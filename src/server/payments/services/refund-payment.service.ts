import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { payment, stripePayment } from "#/db/schema";
import { conflictError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import { stripe } from "#/lib/stripe";
import type {
	RefundPaymentInputType,
	RefundPaymentOutputType,
} from "../payments.types";
import { mapPayment } from "./get-payment.service";

export const refundPayment = async (
	data: RefundPaymentInputType,
): Promise<JsonOk<RefundPaymentOutputType>> => {
	try {
		const [row] = await db
			.select({
				paymentId: payment.id,
				orderId: payment.orderId,
				method: payment.method,
				amount: payment.amount,
				status: payment.status,
				paidAt: payment.paidAt,
				paymentCreatedAt: payment.createdAt,
				paymentUpdatedAt: payment.updatedAt,
				stripePaymentId: stripePayment.id,
				checkoutSessionId: stripePayment.checkoutSessionId,
				paymentIntentId: stripePayment.paymentIntentId,
				customerId: stripePayment.customerId,
				currency: stripePayment.currency,
				checkoutUrl: stripePayment.checkoutUrl,
				stripeStatus: stripePayment.status,
				stripeCreatedAt: stripePayment.createdAt,
				stripeUpdatedAt: stripePayment.updatedAt,
			})
			.from(payment)
			.leftJoin(stripePayment, eq(stripePayment.paymentId, payment.id))
			.where(eq(payment.orderId, data.orderId));

		if (!row) {
			throw notFoundError("Payment not found");
		}

		if (row.method !== "card") {
			throw conflictError("Only Stripe card payments can be refunded here");
		}

		if (row.status !== "paid") {
			throw conflictError("Only paid payments can be refunded");
		}

		if (!row.paymentIntentId) {
			throw conflictError("Stripe payment intent is missing");
		}

		const refund = await stripe.refunds.create({
			payment_intent: row.paymentIntentId,
			metadata: {
				orderId: row.orderId,
				paymentId: row.paymentId,
			},
		});

		const [updatedRow] = await db.transaction(async (tx) => {
			await tx
				.update(payment)
				.set({
					status: "refunded",
				})
				.where(eq(payment.id, row.paymentId));

			await tx
				.update(stripePayment)
				.set({
					status: refund.status ?? "refunded",
				})
				.where(eq(stripePayment.paymentId, row.paymentId));

			return tx
				.select({
					paymentId: payment.id,
					orderId: payment.orderId,
					method: payment.method,
					amount: payment.amount,
					status: payment.status,
					paidAt: payment.paidAt,
					paymentCreatedAt: payment.createdAt,
					paymentUpdatedAt: payment.updatedAt,
					stripePaymentId: stripePayment.id,
					checkoutSessionId: stripePayment.checkoutSessionId,
					paymentIntentId: stripePayment.paymentIntentId,
					customerId: stripePayment.customerId,
					currency: stripePayment.currency,
					checkoutUrl: stripePayment.checkoutUrl,
					stripeStatus: stripePayment.status,
					stripeCreatedAt: stripePayment.createdAt,
					stripeUpdatedAt: stripePayment.updatedAt,
				})
				.from(payment)
				.leftJoin(stripePayment, eq(stripePayment.paymentId, payment.id))
				.where(eq(payment.id, row.paymentId));
		});

		return jsonOk<RefundPaymentOutputType>({
			status: HttpStatusCode.OK,
			message: "Payment refunded successfully",
			data: {
				payment: mapPayment(updatedRow),
				refundId: refund.id,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
