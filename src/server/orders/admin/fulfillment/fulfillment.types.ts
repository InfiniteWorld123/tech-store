import type { z } from "zod";
import type {
	markOrderDeliveredSchema,
	markOrderShippedSchema,
} from "./fulfillment.schemas";

// inferred types
export type MarkOrderShippedType = z.infer<typeof markOrderShippedSchema>;
export type MarkOrderDeliveredType = z.infer<typeof markOrderDeliveredSchema>;

// input types
export type MarkOrderShippedInputType = MarkOrderShippedType;
export type MarkOrderDeliveredInputType = MarkOrderDeliveredType;

// output types
export type MarkOrderShippedOutputType = {
	orderId: string;
	orderStatus: string;
	shippingStatus: string;
	trackingNumber: string;
	shippedAt: string;
};
export type MarkOrderDeliveredOutputType = {
	orderId: string;
	orderStatus: string;
	shippingStatus: string;
	deliveredAt: string;
};
