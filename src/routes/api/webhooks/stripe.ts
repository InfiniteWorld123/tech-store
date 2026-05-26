import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { env } from "#/constants/env";
import { db } from "#/db/drizzle";
import { payment, stripePayment } from "#/db/schema";
import { stripe } from "#/lib/stripe";

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
					const session = event.data.object as Stripe.Checkout.Session;
					const paymentId = session.metadata?.paymentId;

					if (!paymentId) {
						return new Response("Missing payment id", { status: 400 });
					}

					await db.transaction(async (tx) => {
						await tx
							.update(payment)
							.set({
								status: "paid",
								paidAt: new Date(),
							})
							.where(eq(payment.id, paymentId));

						await tx
							.update(stripePayment)
							.set({
								status: session.status ?? "complete",
								paymentIntentId:
									typeof session.payment_intent === "string"
										? session.payment_intent
										: null,
								customerId:
									typeof session.customer === "string"
										? session.customer
										: null,
							})
							.where(eq(stripePayment.checkoutSessionId, session.id));
					});
				}

				return new Response("ok", { status: 200 });
			},
		},
	},
});
