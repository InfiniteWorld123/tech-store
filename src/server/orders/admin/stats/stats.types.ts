import type { z } from "zod";
import type {
    getOrderMetricsValidationSchema,
    getPaymentMetricsValidationSchema,
    getShippingMetricsValidationSchema
} from "./stats.schemas";

// helper types
export type OrderStatusCountsType = {
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
}

export type PaymentStatusCountsType = {
    pending: number;
    paid: number;
    failed: number;
    refunded: number;
}

export type ShippingStatusCountsType = {
    pending: number;
    packed: number;
    shipped: number;
    in_transit: number;
    delivered: number;
}

// inferred types
export type GetOrderMetricsSchemaType = z.infer<typeof getOrderMetricsValidationSchema>

export type GetPaymentMetricsSchemaType = z.infer<typeof getPaymentMetricsValidationSchema>

export type GetShippingMetricsSchemaType = z.infer<typeof getShippingMetricsValidationSchema>

// input types
export type GetOrderMetricsInputType = GetOrderMetricsSchemaType

export type GetPaymentMetricsInputType = GetPaymentMetricsSchemaType

export type GetShippingMetricsInputType = GetShippingMetricsSchemaType

// output types
export type GetOrderMetricsOutputType = {
    overview: {
        totalOrders: number,
        totalRevenue: number,
        averageOrderValue: number,
        activeOrders: number,
        archivedOrders: number,
    };
    byStatus: OrderStatusCountsType;
};

export type GetPaymentMetricsOutputType = {
    totalPayments: number;

    totalCollected: number;
    totalRefunded: number;
    totalPending: number;
    totalFailed: number;

    averagePaymentAmount: number;
    byMethod: {
        card: number,
        paypal: number,
        bank_transfer: number,
        cash_on_delivery: number,
    },
    byStatus: {
        pending: number,
        paid: number,
        failed: number,
        refunded: number,
    }
}

export type GetShippingMetricsOutputType = {
    totalShipments: number,
    byStatus: {
        pending: number;
        packed: number;
        shipped: number;
        in_transit: number;
        delivered: number;
    },
    byMethod: {
        standard: number,
        express: number,
        same_day: number
    },
    byCarrier: {
        dhl: number,
        hermes: number,
        ups: number,
        fedex: number
    }
    averageDeliveryTime: number;
}