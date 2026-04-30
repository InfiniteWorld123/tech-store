import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order, payment } from "#/db/schema";
import { conflictError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	UpdateOrderPaymentStatusInputType,
	UpdateOrderPaymentStatusOutputType,
} from "../admin.types";

export const updateOrderPaymentStatus = async (
	data: UpdateOrderPaymentStatusInputType,
): Promise<JsonOk<UpdateOrderPaymentStatusOutputType>> => {
	try {
		const [row] = await db
			.select({
				orderId: order.id,
				paymentId: payment.id,
				paymentStatus: payment.status,
			})
			.from(order)
			.innerJoin(payment, eq(payment.orderId, order.id))
			.where(eq(order.id, data.orderId));

		if (!row) {
			throw notFoundError("Order payment not found");
		}

		if (row.paymentStatus === data.paymentStatus) {
			throw conflictError("Order payment already has this status");
		}

		const [updatedPayment] = await db
			.update(payment)
			.set({ status: data.paymentStatus })
			.where(eq(payment.orderId, data.orderId))
			.returning({
				orderId: payment.orderId,
				paymentStatus: payment.status,
			});

		return jsonOk<UpdateOrderPaymentStatusOutputType>({
			status: HttpStatusCode.OK,
			message: "Order payment status updated successfully",
			data: {
				orderId: updatedPayment.orderId,
				orderPaymentStatus: updatedPayment.paymentStatus,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
