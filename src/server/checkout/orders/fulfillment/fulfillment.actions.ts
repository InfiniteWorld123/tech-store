import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import { markOrderDeliveredSchema, markOrderShippedSchema } from "./fulfillment.schemas";
import { markOrderShipped } from "./services/mark-order-shipped.service";
import { markOrderDelivered } from "./services/mark-order-delivered.service";

export const markOrderShippedAction = createServerFn({ method: "POST" })
    .middleware([ensureSession])
    .inputValidator(markOrderShippedSchema)
    .handler(async ({ data }) => {
        return markOrderShipped(data);
    });

export const markOrderDeliveredAction = createServerFn({ method: "POST" })
    .middleware([ensureSession])
    .inputValidator(markOrderDeliveredSchema)
    .handler(async ({ data }) => {
        return markOrderDelivered(data);
    });