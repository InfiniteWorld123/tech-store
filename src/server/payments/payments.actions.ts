import { createServerFn } from "@tanstack/react-start";
import {
	ensureAdmin,
	ensureSession,
} from "#/server/auth/ensure-session.middleware";
import {
	confirmOrderPaymentSchema,
	createStripeCheckoutSessionSchema,
	getPaymentSchema,
	listPaymentsSchema,
	refundPaymentSchema,
} from "./payments.schemas";
import { confirmOrderPayment } from "./services/confirm-order-payment.service";
import { createStripeCheckoutSession } from "./services/create-payment.service";
import { getPayment } from "./services/get-payment.service";
import { listPayments } from "./services/list-payments.service";
import { refundPayment } from "./services/refund-payment.service";

export const createStripeCheckoutSessionAction = createServerFn({
	method: "POST",
})
	.middleware([ensureSession])
	.inputValidator(createStripeCheckoutSessionSchema)
	.handler(async ({ context, data }) => {
		return createStripeCheckoutSession({
			...data,
			userId: context.session.user.id,
		});
	});

export const confirmOrderPaymentAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(confirmOrderPaymentSchema)
	.handler(async ({ context, data }) => {
		return confirmOrderPayment({
			...data,
			userId: context.session.user.id,
		});
	});

export const getPaymentAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(getPaymentSchema)
	.handler(async ({ context, data }) => {
		return getPayment({
			...data,
			userId: context.session.user.id,
		});
	});

export const refundPaymentAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(refundPaymentSchema)
	.handler(async ({ data }) => {
		return refundPayment(data);
	});

export const listPaymentsAction = createServerFn({ method: "GET" })
	.middleware([ensureAdmin])
	.inputValidator(listPaymentsSchema)
	.handler(async ({ data }) => {
		return listPayments(data);
	});
