import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order } from "#/db/schema";
import { badRequestError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	CancelOrderInputType,
	CancelOrderOutputType,
} from "../customer.types";
import { getCustomerOrderDetail } from "./get-customer-order-detail.service";

export const cancelOrder = async (
	data: CancelOrderInputType,
): Promise<JsonOk<CancelOrderOutputType>> => {
	try {
		const { orderId, userId } = data;

		const [existingOrder] = await db
			.select({
				status: order.status,
			})
			.from(order)
			.where(and(eq(order.id, orderId), eq(order.userId, userId)));

		if (!existingOrder) {
			throw notFoundError("order not found");
		}

		if (existingOrder.status === "completed") {
			throw badRequestError(
				"Order cannot be cancelled, because the order is completed",
			);
		}

		if (existingOrder.status === "cancelled") {
			throw badRequestError("Order is already cancelled");
		}

		await db
			.update(order)
			.set({ status: "cancelled" })
			.where(eq(order.id, orderId));

		const orderResponse = await getCustomerOrderDetail({ orderId, userId });

		return jsonOk<CancelOrderOutputType>({
			status: HttpStatusCode.OK,
			message: "Order cancelled successfully",
			data: orderResponse.data,
		});
	} catch (error) {
		throw handleError(error);
	}
};
