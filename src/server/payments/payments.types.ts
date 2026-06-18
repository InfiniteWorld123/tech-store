import type { z } from "zod";
import type {
	confirmOrderPaymentSchema,
	createStripeCheckoutSessionSchema,
	getPaymentSchema,
	listPaymentsSchema,
	refundPaymentSchema,
} from "./payments.schemas";

export type CreateStripeCheckoutSessionSchemaType = z.infer<
	typeof createStripeCheckoutSessionSchema
>;

export type CreateStripeCheckoutSessionInputType =
	CreateStripeCheckoutSessionSchemaType & {
		userId: string;
	};

export type GetPaymentInputType = z.infer<typeof getPaymentSchema> & {
	userId: string;
};

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

export type ConfirmOrderPaymentInputType = z.infer<
	typeof confirmOrderPaymentSchema
> & {
	userId: string;
};

export type ConfirmOrderPaymentOutputType = {
	payment: PaymentType;
	confirmed: boolean;
};

export type RefundPaymentOutputType = {
	payment: PaymentType;
	refundId: string;
};

export type ListPaymentsInputType = z.infer<typeof listPaymentsSchema>;

export type PaymentListItemType = {
	id: string;
	orderId: string;
	orderNumber: string;
	method: PaymentType["method"];
	amount: number;
	status: PaymentType["status"];
	currency: string | null;
	paidAt: string | null;
	createdAt: string;
	updatedAt: string;
};

export type ListPaymentsOutputType = {
	items: PaymentListItemType[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
	query: {
		status?: ListPaymentsInputType["status"];
		method?: ListPaymentsInputType["method"];
		search?: string;
		dateRange?: ListPaymentsInputType["dateRange"];
		sortBy: ListPaymentsInputType["sortBy"];
		sortOrder: ListPaymentsInputType["sortOrder"];
	};
};
