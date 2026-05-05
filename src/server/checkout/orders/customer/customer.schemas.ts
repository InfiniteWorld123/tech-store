import { z } from "zod";
import { paymentMethodSchema, shippingCarrierSchema, shippingMethodSchema } from "../admin/admin.schemas";

export const estimateOrderTotalValidationSchema = z.object({
    addressId: z.uuid("Address id must be a valid UUID"),
    shippingMethod: shippingMethodSchema.default("standard"),
});

export const placeOrderFromCartValidationSchema = z.object({
    addressId: z.uuid("Address id must be a valid UUID"),
    paymentMethod: paymentMethodSchema.default("card"),
    shippingMethod: shippingMethodSchema.default("standard"),
    shippingCarrier: shippingCarrierSchema.default("dhl"),
    notes: z.string().min(1, "notes at least should be one character").optional()
});

export const listCustomerOrdersValidationSchema = z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(20).default(10),
    status: z.enum(["all", "active", "completed", "cancelled"]).default("all"),
    year: z.number().int().min(2000).max(new Date().getFullYear()).optional(),
    searchOrderNumber: z.string().trim().min(1).max(100).optional(),
});

export const getCustomerOrderDetailValidationSchema = z.object({
    orderId: z.uuid("Order id must be a valid UUID"),
});

export const cancelOrderValidationSchema = z.object({
    orderId: z.uuid("Order id must be a valid UUID"),
});

export const getOrderTrackingValidationSchema = z.object({
    orderId: z.uuid("Order id must be a valid UUID"),
});

export const reorderOrderValidationSchema = z.object({
    orderId: z.uuid("Order id must be a valid UUID"),
});