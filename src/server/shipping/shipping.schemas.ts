import { z } from "zod";

export const shippingCarrierSchema = z.enum(["dhl", "hermes", "ups", "fedex"]);

export const shippingMethodSchema = z.enum(["standard", "express", "same_day"]);

export const shippingStatusSchema = z.enum([
	"pending",
	"packed",
	"shipped",
	"in_transit",
	"delivered",
]);

export const createShippingSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
	carrier: shippingCarrierSchema,
	method: shippingMethodSchema,
});

export const getShippingSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
});

export const updateShippingStatusSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
	shippingStatus: shippingStatusSchema,
});

export const addTrackingNumberSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
	trackingNumber: z.string().trim().min(1, "Tracking number is required"),
	carrier: shippingCarrierSchema.optional(),
});

export const markOrderShippedSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
	trackingNumber: z.string().trim().min(1, "Tracking number is required"),
});

export const markOrderDeliveredSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
});
