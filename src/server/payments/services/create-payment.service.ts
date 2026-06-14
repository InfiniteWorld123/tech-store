import { and, eq } from "drizzle-orm";
import { env } from "#/constants/env";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order, payment, stripePayment } from "#/db/schema";
import { conflictError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import { stripe } from "#/lib/stripe";
import type {
	CreateStripeCheckoutSessionInputType,
	CreateStripeCheckoutSessionOutputType,
} from "../payments.types";
import {
	isReusableCheckoutSession,
	toStripeAmount,
} from "./stripe-checkout-helpers";

export const createStripeCheckoutSession = async (
	data: CreateStripeCheckoutSessionInputType,
): Promise<JsonOk<CreateStripeCheckoutSessionOutputType>> => {
	try {
		const [row] = await db
			.select({
				orderId: order.id,
				orderNumber: order.orderNumber,
				paymentId: payment.id,
				paymentMethod: payment.method,
				paymentStatus: payment.status,
				amount: payment.amount,
			})
			.from(order)
			.innerJoin(payment, eq(payment.orderId, order.id))
			.where(and(eq(order.id, data.orderId), eq(order.userId, data.userId)));

		if (!row) {
			throw notFoundError("Order payment not found");
		}

		if (row.paymentStatus !== "pending") {
			throw conflictError("Only pending payments can start Stripe checkout");
		}

		if (row.paymentMethod !== "card") {
			throw conflictError(
				"Stripe checkout is only available for card payments",
			);
		}

		const [existingStripePayment] = await db
			.select({
				checkoutSessionId: stripePayment.checkoutSessionId,
				checkoutUrl: stripePayment.checkoutUrl,
				status: stripePayment.status,
			})
			.from(stripePayment)
			.where(eq(stripePayment.paymentId, row.paymentId));

		if (isReusableCheckoutSession(existingStripePayment)) {
			return jsonOk<CreateStripeCheckoutSessionOutputType>({
				status: HttpStatusCode.OK,
				message: "Stripe checkout session already exists",
				data: {
					orderId: row.orderId,
					paymentId: row.paymentId,
					checkoutUrl: existingStripePayment.checkoutUrl,
					checkoutSessionId: existingStripePayment.checkoutSessionId,
				},
			});
		}

		const session = await stripe.checkout.sessions.create({
			mode: "payment",
			line_items: [
				{
					quantity: 1,
					price_data: {
						currency: env.STRIPE_CURRENCY,
						unit_amount: toStripeAmount(row.amount),
						product_data: {
							name: `Order ${row.orderNumber}`,
						},
					},
				},
			],
			success_url: `${env.BASE_URL}/account/orders/${row.orderId}?paid=true`,
			cancel_url: `${env.BASE_URL}/account/orders/${row.orderId}`,
			metadata: {
				orderId: row.orderId,
				paymentId: row.paymentId,
			},
			payment_intent_data: {
				metadata: {
					orderId: row.orderId,
					paymentId: row.paymentId,
				},
			},
		});

		if (!session.url) {
			throw conflictError("Stripe did not return a checkout URL");
		}

		const stripePaymentValues = {
			checkoutSessionId: session.id,
			paymentIntentId:
				typeof session.payment_intent === "string"
					? session.payment_intent
					: null,
			customerId:
				typeof session.customer === "string" ? session.customer : null,
			currency: env.STRIPE_CURRENCY,
			checkoutUrl: session.url,
			status: session.status ?? "open",
		};

		if (existingStripePayment) {
			await db
				.update(stripePayment)
				.set(stripePaymentValues)
				.where(eq(stripePayment.paymentId, row.paymentId));
		} else {
			await db.insert(stripePayment).values({
				paymentId: row.paymentId,
				...stripePaymentValues,
			});
		}

		return jsonOk<CreateStripeCheckoutSessionOutputType>({
			status: HttpStatusCode.CREATED,
			message: "Stripe checkout session created successfully",
			data: {
				orderId: row.orderId,
				paymentId: row.paymentId,
				checkoutUrl: session.url,
				checkoutSessionId: session.id,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
