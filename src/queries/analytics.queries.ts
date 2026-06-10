import { queryOptions } from "@tanstack/react-query";
import {
    getOrderMetricsAction,
    getPaymentMetricsAction,
    getShippingMetricsAction,
    getProductMetricsAction,
    getCustomerMetricsAction,
    getReviewMetricsAction,
    getCartMetricsAction,
} from "../server/analytics/analytics.actions";

export const orderMetricsQueryOptions = () =>
    queryOptions({
        queryKey: ["analytics", "order-metrics"],
        queryFn: () => getOrderMetricsAction({ data: {} }),
    });

export const paymentsMetricsQueryOptions = () =>
    queryOptions({
        queryKey: ["analytics", "payments-metrics"],
        queryFn: () => getPaymentMetricsAction({ data: {} }),
    });

export const productMetricsQueryOptions = () =>
    queryOptions({
        queryKey: ["analytics", "products-metrics"],
        queryFn: () => getProductMetricsAction({ data: {} }),
    });

export const customerMetricsQueryOptions = () =>
    queryOptions({
        queryKey: ["analytics", "customer-metrics"],
        queryFn: () => getCustomerMetricsAction({ data: {} }),
    });

export const reviewMetricsQueryOptions = () =>
    queryOptions({
        queryKey: ["analytics", "review-metrics"],
        queryFn: () => getReviewMetricsAction({ data: {} }),
    });

export const shippingMetricsQueryOptions = () =>
    queryOptions({
        queryKey: ["analytics", "shipping-metrics"],
        queryFn: () => getShippingMetricsAction({ data: {} }),
    });

export const cartMetricsQueryOptions = () =>
    queryOptions({
        queryKey: ["analytics", "cart-metrics"],
        queryFn: () => getCartMetricsAction({ data: {} }),
    });
