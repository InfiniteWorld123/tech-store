import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order } from "#/db/schema";
import { conflictError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	OrderStatusType,
	UpdateOrderStatusInputType,
	UpdateOrderStatusOutputType,
} from "../operational.types";

export const updateOrderStatus = async (
	data: UpdateOrderStatusInputType,
): Promise<JsonOk<UpdateOrderStatusOutputType>> => {
	const { orderId, orderStatus } = data;

	try {
		const [existingOrder] = await db
			.select({
				id: order.id,
				status: order.status,
			})
			.from(order)
			.where(eq(order.id, orderId));

		if (!existingOrder) {
			throw notFoundError("Order not found");
		}

		if (existingOrder.status === orderStatus) {
			throw conflictError("Order already has this status");
		}

		const allowedOrderStatusTransitions: Record<
			OrderStatusType,
			OrderStatusType[]
		> = {
			pending: ["processing", "cancelled"],
			processing: ["completed", "cancelled"],
			completed: [],
			cancelled: [],
		};

		const allowedNextStatuses =
			allowedOrderStatusTransitions[existingOrder.status];

		if (!allowedNextStatuses.includes(orderStatus)) {
			throw conflictError(
				`Cannot change order status from ${existingOrder.status} to ${orderStatus}`,
			);
		}

		const [updatedOrder] = await db
			.update(order)
			.set({ status: orderStatus })
			.where(eq(order.id, orderId))
			.returning({
				id: order.id,
				status: order.status,
			});

		return jsonOk<UpdateOrderStatusOutputType>({
			status: HttpStatusCode.OK,
			message: "Order status is updated successfully",
			data: {
				orderId: updatedOrder.id,
				orderStatus: updatedOrder.status,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
