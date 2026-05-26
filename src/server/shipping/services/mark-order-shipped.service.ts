import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order, shipping } from "#/db/schema";
import { badRequestError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	MarkOrderShippedInputType,
	MarkOrderShippedOutputType,
} from "../shipping.types";

export const markOrderShipped = async (
	data: MarkOrderShippedInputType,
): Promise<JsonOk<MarkOrderShippedOutputType>> => {
	try {
		const { orderId, trackingNumber } = data;

		const [existingOrder] = await db
			.select({ id: order.id, status: order.status })
			.from(order)
			.where(eq(order.id, orderId));

		if (!existingOrder) throw notFoundError("Order not found");

		if (existingOrder.status === "cancelled") {
			throw badRequestError("Cannot ship a cancelled order");
		}

		if (existingOrder.status === "completed") {
			throw badRequestError("Cannot ship a completed order");
		}

		const shippedAt = new Date();

		const [updatedShipping] = await db
			.update(shipping)
			.set({
				status: "shipped",
				trackingNumber,
				shippedAt,
			})
			.where(eq(shipping.orderId, orderId))
			.returning({ trackingNumber: shipping.trackingNumber });

		if (!updatedShipping) {
			throw notFoundError("Shipping not found");
		}

		const [updatedOrder] = await db
			.update(order)
			.set({ status: "processing" })
			.where(eq(order.id, orderId))
			.returning({ id: order.id, status: order.status });

		return jsonOk<MarkOrderShippedOutputType>({
			status: HttpStatusCode.OK,
			message: "Order marked as shipped successfully",
			data: {
				orderId: updatedOrder.id,
				orderStatus: updatedOrder.status,
				shippingStatus: "shipped",
				trackingNumber: updatedShipping.trackingNumber ?? trackingNumber,
				shippedAt: shippedAt.toISOString(),
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
