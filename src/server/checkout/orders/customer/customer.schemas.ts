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
