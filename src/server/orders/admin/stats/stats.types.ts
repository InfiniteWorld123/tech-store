import type { OrderStatusType, PaymentStatusType, ShippingStatusType } from "../operational/operational.types";

export type OrderMetricsOutputType = {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    ordersToday: number;
    ordersThisWeek: number;
    ordersThisMonth: number;
};

export type RevenueMetricsOutputType = {
    totalRevenue: number;
    averageOrderValue: number;
    revenueToday: number;
    revenueThisWeek: number;
    revenueThisMonth: number;
};

export type PaymentMetricsOutputType = {
    paidOrders: number;
    pendingPayments: number;
    failedPayments: number;
    refundedPayments: number;
};

export type ShippingMetricsOutputType = {
    readyToShip: number;
    packed: number;
    shipped: number;
    inTransit: number;
    delivered: number;
};
