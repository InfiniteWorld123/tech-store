import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order, shipping } from "#/db/schema";
import { conflictError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	UpdateOrderShippingStatusInputType,
	UpdateOrderShippingStatusOutputType,
} from "../operational.types";

export const updateOrderShippingStatus = async (
	data: UpdateOrderShippingStatusInputType,
): Promise<JsonOk<UpdateOrderShippingStatusOutputType>> => {
	try {
		const [row] = await db
			.select({
				orderId: order.id,
				shippingId: shipping.id,
				shippingStatus: shipping.status,
			})
			.from(order)
			.innerJoin(shipping, eq(shipping.orderId, order.id))
			.where(eq(order.id, data.orderId));

		if (!row) {
			throw notFoundError("Order shipping not found");
		}

		if (row.shippingStatus === data.shippingStatus) {
			throw conflictError("Order shipping already has this status");
		}

		const [updatedShipping] = await db
			.update(shipping)
			.set({ status: data.shippingStatus })
			.where(eq(shipping.orderId, data.orderId))
			.returning({
				orderId: shipping.orderId,
				shippingStatus: shipping.status,
			});

		return jsonOk<UpdateOrderShippingStatusOutputType>({
			status: HttpStatusCode.OK,
			message: "Order shipping status updated successfully",
			data: {
				orderId: updatedShipping.orderId,
				orderShippingStatus: updatedShipping.shippingStatus,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
