import { z } from "zod";
import {
	paymentMethodSchema,
	shippingCarrierSchema,
	shippingMethodSchema,
} from "../admin/admin.schemas";

export const estimateOrderTotalSchema = z.object({
	addressId: z.uuid("Address id must be a valid UUID"),
	shippingMethod: shippingMethodSchema.default("standard"),
});

export const placeOrderFromCartSchema = z.object({
	addressId: z.uuid("Address id must be a valid UUID"),
	paymentMethod: paymentMethodSchema.default("card"),
	shippingMethod: shippingMethodSchema.default("standard"),
	shippingCarrier: shippingCarrierSchema.default("dhl"),
	notes: z.string().min(1, "notes at least should be one character").optional(),
});

export const listCustomerOrdersSchema = z.object({
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(20).default(10),
	status: z.enum(["all", "active", "completed", "cancelled"]).default("all"),
	year: z.number().int().min(2000).max(new Date().getFullYear()).optional(),
	searchOrderNumber: z.string().trim().min(1).max(100).optional(),
});

export const getCustomerOrderDetailSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
});

export const cancelOrderSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
});

export const getOrderTrackingSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
});

export const reorderOrderSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
});
