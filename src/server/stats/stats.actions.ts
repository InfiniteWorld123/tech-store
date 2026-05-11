import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import {
    getOrderMetricsValidationSchema,
    getPaymentMetricsValidationSchema,
    getShippingMetricsValidationSchema,
    getProductMetricsValidationSchema,
    getCustomerMetricsValidationSchema,
    getReviewMetricsValidationSchema,
    getCartMetricsValidationSchema,
} from "./stats.schemas";
import { getOrderMetrics } from "./services/get-order-metrics.service";
import { getPaymentMetrics } from "./services/get-payment-metrics.service";
import { getShippingMetrics } from "./services/get-shipping-metrics.service";
import { getProductMetrics } from "./services/get-product-metrics.service";
import { getCustomerMetrics } from "./services/get-customer-metrics.service";
import { getReviewMetrics } from "./services/get-review-metrics.service";
import { getCartMetrics } from "./services/get-cart-metrics.service";

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

export const getProductMetricsAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getProductMetricsValidationSchema)
    .handler(async ({ data }) => {
        return getProductMetrics(data);
    });

export const getCustomerMetricsAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getCustomerMetricsValidationSchema)
    .handler(async ({ data }) => {
        return getCustomerMetrics(data);
    });

export const getReviewMetricsAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getReviewMetricsValidationSchema)
    .handler(async ({ data }) => {
        return getReviewMetrics(data);
    });

export const getCartMetricsAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getCartMetricsValidationSchema)
    .handler(async ({ data }) => {
        return getCartMetrics(data);
    });