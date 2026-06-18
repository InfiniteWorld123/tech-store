import { z } from "zod";

export const createStripeCheckoutSessionSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
});

export const getPaymentSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
});

export const confirmOrderPaymentSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
});

export const refundPaymentSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
});

export const listPaymentsSchema = z.object({
	status: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
	method: z
		.enum(["card", "paypal", "bank_transfer", "cash_on_delivery"])
		.optional(),
	search: z.string().trim().min(1).optional(),
	dateRange: z
		.object({
			from: z.string().datetime().optional(),
			to: z.string().datetime().optional(),
		})
		.optional(),
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(100).default(20),
	sortBy: z.enum(["createdAt", "amount", "paidAt"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
