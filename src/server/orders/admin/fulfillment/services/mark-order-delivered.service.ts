import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order, shipping } from "#/db/schema";
import { badRequestError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	MarkOrderDeliveredInputType,
	MarkOrderDeliveredOutputType,
} from "../fulfillment.types";

export const markOrderDelivered = async (
	data: MarkOrderDeliveredInputType,
): Promise<JsonOk<MarkOrderDeliveredOutputType>> => {
	try {
		const { orderId } = data;

		const [existingOrder] = await db
			.select({ id: order.id, status: order.status })
			.from(order)
			.where(eq(order.id, orderId));

		if (!existingOrder) throw notFoundError("Order not found");

		if (existingOrder.status === "cancelled") {
			throw badRequestError("Cannot deliver a cancelled order");
		}

		if (existingOrder.status === "completed") {
			throw badRequestError("Order is already delivered");
		}

		await db
			.update(shipping)
			.set({
				status: "delivered",
				deliveredAt: new Date(),
			})
			.where(eq(shipping.orderId, orderId));

		const [updatedOrder] = await db
			.update(order)
			.set({ status: "completed" })
			.where(eq(order.id, orderId))
			.returning({ id: order.id, status: order.status });

		return jsonOk<MarkOrderDeliveredOutputType>({
			status: HttpStatusCode.OK,
			message: "Order marked as delivered successfully",
			data: {
				orderId: updatedOrder.id,
				orderStatus: updatedOrder.status,
				shippingStatus: "delivered",
				deliveredAt: new Date().toISOString(),
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
