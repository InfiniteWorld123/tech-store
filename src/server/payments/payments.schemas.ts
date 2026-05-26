import { z } from "zod";

export const paymentStatusSchema = z.enum([
	"pending",
	"paid",
	"failed",
	"refunded",
]);

export const updatePaymentStatusSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
	paymentStatus: paymentStatusSchema,
});
