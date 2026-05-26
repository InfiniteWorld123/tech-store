import { z } from "zod";

export const createStripeCheckoutSessionSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
});

export const getPaymentSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
});

export const refundPaymentSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
});
