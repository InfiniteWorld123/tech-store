import { queryOptions } from "@tanstack/react-query"
import {
    getOrderMetricsAction,
    getPaymentMetricsAction,
    getShippingMetricsAction,
    getProductMetricsAction,
    getCustomerMetricsAction,
    getReviewMetricsAction,
    getCartMetricsAction,
} from "../server/analytics/analytics.actions"


export const useGetOrderMetricsQueryOptions = () =>
    queryOptions({
        queryKey: ["analytics", "order-metrics"],
        queryFn: () => getOrderMetricsAction({ data: {} }),

    })

export const useGetPaymentsMetricsQueryOptions = () =>
    queryOptions({
        queryKey: ["analytics", "payments-metrics"],
        queryFn: () => getPaymentMetricsAction({ data: {} })

    })

export const useGetProductMetricsQueryOptions = () =>
    queryOptions({
        queryKey: ["analytics", "products-metrics"],
        queryFn: () => getProductMetricsAction({ data: {} })
    })

export const useGetCustomerMetricsQueryOptions = () =>
    queryOptions({
        queryKey: ["analytics", "customer-metrics"],
        queryFn: () => getCustomerMetricsAction({ data: {} })
    })

export const useGetReviewMetricsQueryOptions = () =>
    queryOptions({
        queryKey: ["analytics", "review-metrics"],
        queryFn: () => getReviewMetricsAction({ data: {} })
    })

export const useGetShippingMetricsQueryOptions = () =>
    queryOptions({
        queryKey: ["analytics", "shipping-metrics"],
        queryFn: () => getShippingMetricsAction({ data: {} })
    })

export const useGetCartMetricsQueryOptions = () =>
    queryOptions({
        queryKey: ["analytics", "cart-metrics"],
        queryFn: () => getCartMetricsAction({ data: {} })
    })