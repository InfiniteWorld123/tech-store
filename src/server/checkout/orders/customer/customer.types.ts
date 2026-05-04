import type { z } from "zod";
import type { CartWarningType } from "../../cart/cart.types";
import type { ShippingCarrierType, PaymentMethodType, ShippingMethodType } from "../admin/admin.types";
import type { estimateOrderTotalValidationSchema, placeOrderFromCartValidationSchema } from "./customer.schemas";

export type EstimateOrderTotalSchemaType = z.infer<
    typeof estimateOrderTotalValidationSchema
>;

export type PlaceOrderFromCartType = z.infer<
    typeof placeOrderFromCartValidationSchema
>;

export type EstimatedOrderItemType = {
    variantId: string;
    productId: string;
    productName: string;
    variantName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
};

// input types
export type EstimateOrderTotalInputType = EstimateOrderTotalSchemaType & {
    userId: string;
};

export type PlaceOrderFromCartInputType = PlaceOrderFromCartType & {
    userId: string
}

// output types
export type EstimateOrderTotalOutputType = {
    items: EstimatedOrderItemType[];
    summary: {
        itemsCount: number;
        uniqueItemsCount: number;
        subtotal: number;
        shippingFee: number;
        taxAmount: number;
        totalAmount: number;
        taxRate: number;
        shippingMethod: ShippingMethodType;
        canCheckout: boolean;
    };
    warnings: CartWarningType[];
};

export type PlaceOrderFromCartOutputType = {
    order: {
        id: string;
        orderNumber: string;
        status: "pending";
        subtotal: number;
        shippingFee: number;
        taxAmount: number;
        totalAmount: number;
        placedAt: string;
    };
    payment: {
        method: PaymentMethodType;
        status: "pending";
        amount: number;
    };
    shipping: {
        method: ShippingMethodType;
        carrier: ShippingCarrierType;
        status: "pending";
    };
    items: EstimatedOrderItemType[];
}

/*
    1. Get userId from middleware context.
    2. Validate cart using your existing validateCart service.
    3. Check address belongs to user.
    4. Calculate subtotal, shipping fee, tax, total.
    5. Start database transaction.
    6. Insert order row.
    7. Insert order item rows.
    8. Insert payment row.
    9. Insert shipping row.
    10. Decrease stock.
    11. Delete cart items.
    12. Return created order summary.
 */