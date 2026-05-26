import type { z } from "zod";
import type {
	paymentStatusSchema,
	updatePaymentStatusSchema,
} from "./payments.schemas";

export type PaymentStatusType = z.infer<typeof paymentStatusSchema>;

export type UpdatePaymentStatusInputType = z.infer<
	typeof updatePaymentStatusSchema
>;

export type UpdatePaymentStatusOutputType = {
	orderId: string;
	orderPaymentStatus: PaymentStatusType;
};
