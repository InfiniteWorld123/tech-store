import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { env } from "#/constants/env";
import { db } from "#/db/drizzle";
import { payment, stripePayment } from "#/db/schema";
import { stripe } from "#/lib/stripe";

const stripeObjectId = (
	value: string | { id: string } | null,
): string | null => {
	if (typeof value === "string") {
		return value;
	}

	return value?.id ?? null;
};

const markCheckoutSessionCompleted = async (
	session: Stripe.Checkout.Session,
) => {
	const paymentId = session.metadata?.paymentId;

	if (!paymentId) {
		return new Response("Missing payment id", { status: 400 });
	}

	await db
		.update(payment)
		.set({
			status: "paid",
			paidAt: new Date(),
		})
		.where(eq(payment.id, paymentId));

	await db
		.update(stripePayment)
		.set({
			status: session.status ?? "complete",
			paymentIntentId: stripeObjectId(session.payment_intent),
			customerId: stripeObjectId(session.customer),
		})
		.where(eq(stripePayment.checkoutSessionId, session.id));
};

const markCheckoutSessionExpired = async (session: Stripe.Checkout.Session) => {
	// The payment stays pending so the customer can create a fresh checkout URL.
	await db
		.update(stripePayment)
		.set({
			status: session.status ?? "expired",
			checkoutUrl: null,
			paymentIntentId: stripeObjectId(session.payment_intent),
			customerId: stripeObjectId(session.customer),
		})
		.where(eq(stripePayment.checkoutSessionId, session.id));
};

const markPaymentIntentFailed = async (intent: Stripe.PaymentIntent) => {
	const paymentId = intent.metadata.paymentId;

	if (!paymentId) {
		return new Response("Missing payment id", { status: 400 });
	}

	await db
		.update(payment)
		.set({
			status: "failed",
		})
		.where(eq(payment.id, paymentId));

	await db
		.update(stripePayment)
		.set({
			status: intent.status,
			paymentIntentId: intent.id,
			customerId: stripeObjectId(intent.customer),
		})
		.where(eq(stripePayment.paymentId, paymentId));
};

const markRefundUpdated = async (refund: Stripe.Refund) => {
	const paymentIntentId = stripeObjectId(refund.payment_intent);

	if (!paymentIntentId) {
		return new Response("Missing payment intent id", { status: 400 });
	}

	const [stripeRow] = await db
		.select({
			paymentId: stripePayment.paymentId,
		})
		.from(stripePayment)
		.where(eq(stripePayment.paymentIntentId, paymentIntentId));

	if (!stripeRow) {
		return;
	}

	const nextPaymentStatus = refund.status === "succeeded" ? "refunded" : "paid";

	await db
		.update(payment)
		.set({
			status: nextPaymentStatus,
		})
		.where(eq(payment.id, stripeRow.paymentId));

	await db
		.update(stripePayment)
		.set({
			status: refund.status ?? "refund_updated",
		})
		.where(eq(stripePayment.paymentId, stripeRow.paymentId));
};

const markChargeRefunded = async (charge: Stripe.Charge) => {
	const paymentIntentId = stripeObjectId(charge.payment_intent);

	if (!paymentIntentId) {
		return new Response("Missing payment intent id", { status: 400 });
	}

	const [stripeRow] = await db
		.select({
			paymentId: stripePayment.paymentId,
		})
		.from(stripePayment)
		.where(eq(stripePayment.paymentIntentId, paymentIntentId));

	if (!stripeRow) {
		return;
	}

	await db
		.update(payment)
		.set({
			status: "refunded",
		})
		.where(eq(payment.id, stripeRow.paymentId));

	await db
		.update(stripePayment)
		.set({
			status: "refunded",
		})
		.where(eq(stripePayment.paymentId, stripeRow.paymentId));
};

export const Route = createFileRoute("/api/webhooks/stripe")({
	server: {
		handlers: {
			POST: async ({ request }: { request: Request }) => {
				const body = await request.text();
				const signature = request.headers.get("stripe-signature");

				if (!signature) {
					return new Response("Missing Stripe signature", { status: 400 });
				}

				let event: Stripe.Event;

				try {
					event = stripe.webhooks.constructEvent(
						body,
						signature,
						env.STRIPE_WEBHOOK_SECRET,
					);
				} catch (_error) {
					return new Response("Invalid Stripe signature", { status: 400 });
				}

				if (event.type === "checkout.session.completed") {
					const response = await markCheckoutSessionCompleted(
						event.data.object as Stripe.Checkout.Session,
					);
					if (response) {
						return response;
					}
				}

				if (event.type === "checkout.session.expired") {
					await markCheckoutSessionExpired(
						event.data.object as Stripe.Checkout.Session,
					);
				}

				if (event.type === "payment_intent.payment_failed") {
					const response = await markPaymentIntentFailed(
						event.data.object as Stripe.PaymentIntent,
					);
					if (response) {
						return response;
					}
				}

				if (
					event.type === "refund.created" ||
					event.type === "refund.updated"
				) {
					const response = await markRefundUpdated(
						event.data.object as Stripe.Refund,
					);
					if (response) {
						return response;
					}
				}

				if (event.type === "charge.refunded") {
					const response = await markChargeRefunded(
						event.data.object as Stripe.Charge,
					);
					if (response) {
						return response;
					}
				}

				return new Response("ok", { status: 200 });
			},
		},
	},
});
