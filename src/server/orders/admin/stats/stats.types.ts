import type { z } from "zod";
import type {
    getCartMetricsValidationSchema,
    getCustomerMetricsValidationSchema,
    getOrderMetricsValidationSchema,
    getPaymentMetricsValidationSchema,
    getProductMetricsValidationSchema,
    getReviewMetricsValidationSchema,
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

export type GetProductMetricsSchemaType = z.infer<typeof getProductMetricsValidationSchema>

export type GetCustomerMetricsSchemaType = z.infer<typeof getCustomerMetricsValidationSchema>

export type GetReviewMetricsSchemaType = z.infer<typeof getReviewMetricsValidationSchema>

export type GetCartMetricsSchemaType = z.infer<typeof getCartMetricsValidationSchema>

// input types
export type GetOrderMetricsInputType = GetOrderMetricsSchemaType

export type GetPaymentMetricsInputType = GetPaymentMetricsSchemaType

export type GetShippingMetricsInputType = GetShippingMetricsSchemaType

export type GetProductMetricsInputType = GetProductMetricsSchemaType

export type GetCustomerMetricsInputType = GetProductMetricsSchemaType

export type GetReviewMetricsInputType = GetProductMetricsSchemaType

export type GetCartMetricsInputType = GetProductMetricsSchemaType

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

export type GetProductMetricsOutputType = {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    featuredProducts: number;
    bestsellerProducts: number;
    totalVariants: number;
    outOfStockVariants: number;
    lowStockVariants: number;
    averageProductRating: number;
    totalReviewsAcrossProducts: number;
    productsWithNoReviews: number;
    productsWithDiscount: number;
};

export type GetCustomerMetricsOutputType = {
    totalCustomers: number;
    verifiedCustomers: number;
    unverifiedCustomers: number;
    customersWithOrders: number;
    customersWithoutOrders: number;
    customersWithSavedAddresses: number;
    customersWithReviews: number;
};

export type GetReviewMetricsOutputType = {
    totalReviews: number;
    averageRating: number;
    highestRatedProduct: number;    // max ratingAvg across products
    lowestRatedProduct: number;     // min ratingAvg across products
    productsWithReviews: number;
    byStar: {
        one: number;
        two: number;
        three: number;
        four: number;
        five: number;
    };
};

export type GetCartMetricsOutputType = {
    totalCarts: number;
    guestCarts: number;
    userCarts: number;
    emptyCarts: number;             // carts with no items
    activeCarts: number;            // carts with at least 1 item
    totalItemsInCarts: number;
    averageItemsPerCart: number;
    averageCartValue: number;
};