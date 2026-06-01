import { createServerFn } from "@tanstack/react-start";
import { ensureAdmin } from "#/server/auth/ensure-session.middleware";
import {
	getCartMetricsSchema,
	getCustomerMetricsSchema,
	getOrderMetricsSchema,
	getPaymentMetricsSchema,
	getProductMetricsSchema,
	getReviewMetricsSchema,
	getShippingMetricsSchema,
} from "./analytics.schemas";
import { getCartMetrics } from "./services/get-cart-metrics.service";
import { getCustomerMetrics } from "./services/get-customer-metrics.service";
import { getOrderMetrics } from "./services/get-order-metrics.service";
import { getPaymentMetrics } from "./services/get-payment-metrics.service";
import { getProductMetrics } from "./services/get-product-metrics.service";
import { getReviewMetrics } from "./services/get-review-metrics.service";
import { getShippingMetrics } from "./services/get-shipping-metrics.service";

export const getOrderMetricsAction = createServerFn({ method: "GET" })
	.middleware([ensureAdmin])
	.inputValidator(getOrderMetricsSchema)
	.handler(async ({ data }) => {
		return getOrderMetrics(data);
	});

export const getPaymentMetricsAction = createServerFn({ method: "GET" })
	.middleware([ensureAdmin])
	.inputValidator(getPaymentMetricsSchema)
	.handler(async ({ data }) => {
		return getPaymentMetrics(data);
	});

export const getShippingMetricsAction = createServerFn({ method: "GET" })
	.middleware([ensureAdmin])
	.inputValidator(getShippingMetricsSchema)
	.handler(async ({ data }) => {
		return getShippingMetrics(data);
	});

export const getProductMetricsAction = createServerFn({ method: "GET" })
	.middleware([ensureAdmin])
	.inputValidator(getProductMetricsSchema)
	.handler(async ({ data }) => {
		return getProductMetrics(data);
	});

export const getCustomerMetricsAction = createServerFn({ method: "GET" })
	.middleware([ensureAdmin])
	.inputValidator(getCustomerMetricsSchema)
	.handler(async ({ data }) => {
		return getCustomerMetrics(data);
	});

export const getReviewMetricsAction = createServerFn({ method: "GET" })
	.middleware([ensureAdmin])
	.inputValidator(getReviewMetricsSchema)
	.handler(async ({ data }) => {
		return getReviewMetrics(data);
	});

export const getCartMetricsAction = createServerFn({ method: "GET" })
	.middleware([ensureAdmin])
	.inputValidator(getCartMetricsSchema)
	.handler(async ({ data }) => {
		return getCartMetrics(data);
	});
