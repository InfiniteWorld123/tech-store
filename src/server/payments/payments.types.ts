import type { z } from "zod";
import type {
	createStripeCheckoutSessionSchema,
	getPaymentSchema,
	refundPaymentSchema,
} from "./payments.schemas";

export type CreateStripeCheckoutSessionSchemaType = z.infer<
	typeof createStripeCheckoutSessionSchema
>;

export type CreateStripeCheckoutSessionInputType =
	CreateStripeCheckoutSessionSchemaType;

export type GetPaymentInputType = z.infer<typeof getPaymentSchema>;

export type RefundPaymentInputType = z.infer<typeof refundPaymentSchema>;

export type PaymentType = {
	id: string;
	orderId: string;
	method: "card" | "paypal" | "bank_transfer" | "cash_on_delivery";
	amount: number;
	status: "pending" | "paid" | "failed" | "refunded";
	paidAt: string | null;
	createdAt: string;
	updatedAt: string;
	stripe: {
		id: string;
		checkoutSessionId: string;
		paymentIntentId: string | null;
		customerId: string | null;
		currency: string;
		checkoutUrl: string | null;
		status: string;
		createdAt: string;
		updatedAt: string;
	} | null;
};

export type CreateStripeCheckoutSessionOutputType = {
	orderId: string;
	paymentId: string;
	checkoutUrl: string;
	checkoutSessionId: string;
};

export type GetPaymentOutputType = {
	payment: PaymentType;
};

export type RefundPaymentOutputType = {
	payment: PaymentType;
	refundId: string;
};
