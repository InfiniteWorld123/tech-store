import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import { getOrderMetricsSchema, getPaymentMetricsSchema, getRevenueMetricsSchema, getShippingMetricsSchema } from "./stats.schemas";
import { getOrderMetrics } from "./services/get-order-metrics.service";
import { getRevenueMetrics } from "./services/get-revenue-metrics.service";
import { getPaymentMetrics } from "./services/get-payment-metrics.service";
import { getShippingMetrics } from "./services/get-shipping-metrics.service";

export const getOrderMetricsAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getOrderMetricsSchema)
    .handler(async () => {
        return getOrderMetrics();
    });

export const getRevenueMetricsAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getRevenueMetricsSchema)
    .handler(async () => {
        return getRevenueMetrics();
    });

export const getPaymentMetricsAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getPaymentMetricsSchema)
    .handler(async () => {
        return getPaymentMetrics();
    });

export const getShippingMetricsAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getShippingMetricsSchema)
    .handler(async () => {
        return getShippingMetrics();
    });
