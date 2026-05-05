import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import { getOrderMetricsValidationSchema, getPaymentMetricsValidationSchema, getShippingMetricsValidationSchema } from "./stats.schemas";
import { getOrderMetrics } from "./services/get-order-metrics.service";
import { getPaymentMetrics } from "./services/get-payment-metrics.service";
import { getShippingMetrics } from "./services/get-shipping-metrics.service";

export const getOrderMetricsAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getOrderMetricsValidationSchema)
    .handler(async ({ data }) => {
        return getOrderMetrics(data);
    });

export const getPaymentMetricsAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getPaymentMetricsValidationSchema)
    .handler(async ({ data }) => {
        return getPaymentMetrics(data);
    });

export const getShippingMetricsAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getShippingMetricsValidationSchema)
    .handler(async ({ data }) => {
        return getShippingMetrics(data);
    });