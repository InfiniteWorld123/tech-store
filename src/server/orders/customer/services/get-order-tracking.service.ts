import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order, shipping } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	GetOrderTrackingInputType,
	GetOrderTrackingOutputType,
} from "../customer.types";

export const getOrderTracking = async (
	data: GetOrderTrackingInputType,
): Promise<JsonOk<GetOrderTrackingOutputType>> => {
	try {
		const { orderId, userId } = data;

		const [existingOrder] = await db
			.select({
				orderNumber: order.orderNumber,
				orderStatus: order.status,
				placedAt: order.placedAt,

				carrier: shipping.carrier,
				shippingMethod: shipping.method,
				trackingNumber: shipping.trackingNumber,
				shippingStatus: shipping.status,
				shippedAt: shipping.shippedAt,
				deliveredAt: shipping.deliveredAt,
			})
			.from(order)
			.innerJoin(shipping, eq(shipping.orderId, order.id))
			.where(and(eq(order.id, orderId), eq(order.userId, userId)));

		if (!existingOrder) {
			throw notFoundError("order not found");
		}

		const canTrack = existingOrder.trackingNumber !== null;

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "tracking order data are fetched successfully",
			data: {
				orderNumber: existingOrder.orderNumber,
				orderStatus: existingOrder.orderStatus,
				placedAt: existingOrder.placedAt.toISOString(),
				shipping: {
					carrier: existingOrder.carrier,
					method: existingOrder.shippingMethod, // ← was shippingMethod, type expects method
					trackingNumber: existingOrder.trackingNumber,
					status: existingOrder.shippingStatus, // ← was shippingStatus, type expects status
					shippedAt: existingOrder.shippedAt?.toISOString() ?? null,
					deliveredAt: existingOrder.deliveredAt?.toISOString() ?? null,
				},
				canTrack,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
