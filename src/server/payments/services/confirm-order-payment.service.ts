import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order, payment, stripePayment } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import { stripe } from "#/lib/stripe";
import type {
	ConfirmOrderPaymentInputType,
	ConfirmOrderPaymentOutputType,
} from "../payments.types";
import { mapPayment } from "./get-payment.service";

const paymentSelection = {
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
};

const stripeObjectId = (
	value: string | { id: string } | null,
): string | null => {
	if (typeof value === "string") return value;

	return value?.id ?? null;
};

/**
 * Reconciles a Stripe card payment by asking Stripe directly whether the
 * checkout session was paid. This is the fallback used when the customer
 * returns from Stripe, so the payment becomes "paid" even if the
 * `checkout.session.completed` webhook is delayed or never arrives (e.g. on
 * localhost without the Stripe CLI forwarder). It is idempotent — calling it
 * on an already-paid payment is a no-op.
 */
export const confirmOrderPayment = async (
	data: ConfirmOrderPaymentInputType,
): Promise<JsonOk<ConfirmOrderPaymentOutputType>> => {
	try {
		const [row] = await db
			.select(paymentSelection)
			.from(payment)
			.innerJoin(order, eq(order.id, payment.orderId))
			.leftJoin(stripePayment, eq(stripePayment.paymentId, payment.id))
			.where(
				and(eq(payment.orderId, data.orderId), eq(order.userId, data.userId)),
			);

		if (!row) {
			throw notFoundError("Payment not found");
		}

		// Nothing to confirm: already settled, not a Stripe card payment, or no
		// checkout session was ever created.
		if (
			row.status !== "pending" ||
			row.method !== "card" ||
			!row.checkoutSessionId
		) {
			return jsonOk<ConfirmOrderPaymentOutputType>({
				status: HttpStatusCode.OK,
				message: "Payment is already up to date",
				data: { payment: mapPayment(row), confirmed: false },
			});
		}

		const session = await stripe.checkout.sessions.retrieve(
			row.checkoutSessionId,
		);

		if (session.payment_status !== "paid") {
			return jsonOk<ConfirmOrderPaymentOutputType>({
				status: HttpStatusCode.OK,
				message: "Payment has not been completed yet",
				data: { payment: mapPayment(row), confirmed: false },
			});
		}

		await db
			.update(payment)
			.set({ status: "paid", paidAt: new Date() })
			.where(eq(payment.id, row.paymentId));

		await db
			.update(stripePayment)
			.set({
				status: session.status ?? "complete",
				paymentIntentId: stripeObjectId(session.payment_intent),
				customerId: stripeObjectId(session.customer),
			})
			.where(eq(stripePayment.paymentId, row.paymentId));

		const [updatedRow] = await db
			.select(paymentSelection)
			.from(payment)
			.leftJoin(stripePayment, eq(stripePayment.paymentId, payment.id))
			.where(eq(payment.id, row.paymentId));

		return jsonOk<ConfirmOrderPaymentOutputType>({
			status: HttpStatusCode.OK,
			message: "Payment confirmed successfully",
			data: { payment: mapPayment(updatedRow ?? row), confirmed: true },
		});
	} catch (error) {
		throw handleError(error);
	}
};
