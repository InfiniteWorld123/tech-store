import { z } from "zod";

export const markOrderShippedSchema = z.object({
    orderId: z.uuid("Order id must be a valid UUID"),
    trackingNumber: z.string().trim().min(1, "Tracking number is required"),
});

export const markOrderDeliveredSchema = z.object({
    orderId: z.uuid("Order id must be a valid UUID"),
});