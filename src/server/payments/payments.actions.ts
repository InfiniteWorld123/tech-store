import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import {
	createStripeCheckoutSessionSchema,
	getPaymentSchema,
	refundPaymentSchema,
} from "./payments.schemas";
import { createStripeCheckoutSession } from "./services/create-payment.service";
import { getPayment } from "./services/get-payment.service";
import { refundPayment } from "./services/refund-payment.service";

export const createStripeCheckoutSessionAction = createServerFn({
	method: "POST",
})
	.middleware([ensureSession])
	.inputValidator(createStripeCheckoutSessionSchema)
	.handler(async ({ data }) => {
		return createStripeCheckoutSession(data);
	});

export const getPaymentAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(getPaymentSchema)
	.handler(async ({ data }) => {
		return getPayment(data);
	});

export const refundPaymentAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(refundPaymentSchema)
	.handler(async ({ data }) => {
		return refundPayment(data);
	});
