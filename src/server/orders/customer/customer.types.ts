import type { z } from "zod";
import type { CartWarningType } from "../../cart/cart.types";
import type {
	OrderStatusType,
	PaymentMethodType,
	PaymentStatusType,
	ShippingCarrierType,
	ShippingMethodType,
	ShippingStatusType,
} from "../admin/operational/operational.types";
import type {
	cancelOrderValidationSchema,
	estimateOrderTotalValidationSchema,
	getCustomerOrderDetailValidationSchema,
	getOrderTrackingValidationSchema,
	listCustomerOrdersValidationSchema,
	placeOrderFromCartValidationSchema,
	reorderOrderValidationSchema,
} from "./customer.schemas";

// helper types
export type EstimatedOrderItemType = {
	variantId: string;
	productId: string;
	productName: string;
	variantName: string;
	sku: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	image?: string | null;
};

export type CustomerOrderListItemType = {
	id: string;
	orderNumber: string;
	status: OrderStatusType;
	totalAmount: number;
	placedAt: string;
	itemCount: number;
	firstItemName: string | null;
	firstItemImage: string | null;
	payment: {
		status: PaymentStatusType;
	};
	shipping: {
		status: ShippingStatusType;
		trackingNumber: string | null;
	};
	canCancel: boolean;
	canTrack: boolean;
};

export type CustomerOrderDetailType = {
	id: string;
	orderNumber: string;
	status: OrderStatusType;
	subtotal: number;
	shippingFee: number;
	taxAmount: number;
	totalAmount: number;
	notes: string | null;
	placedAt: string;
	items: EstimatedOrderItemType[];
	itemCount: number;
	payment: {
		method: PaymentMethodType;
		amount: number;
		status: PaymentStatusType;
		paidAt: string | null;
	};
	shipping: {
		carrier: ShippingCarrierType;
		method: ShippingMethodType;
		trackingNumber: string | null;
		status: ShippingStatusType;
		shippedAt: string | null;
		deliveredAt: string | null;
	};
	address: {
		fullName: string;
		phone: string;
		street: string;
		postalCode: string;
		city: string;
		state: string | null;
		country: string;
	};
	canCancel: boolean;
	canTrack: boolean;
};

// inferring types
export type EstimateOrderTotalSchemaType = z.infer<
	typeof estimateOrderTotalValidationSchema
>;

export type PlaceOrderFromCartType = z.infer<
	typeof placeOrderFromCartValidationSchema
>;

export type ListCustomerOrdersSchemaType = z.infer<
	typeof listCustomerOrdersValidationSchema
>;

export type GetCustomerOrderDetailSchemaType = z.infer<
	typeof getCustomerOrderDetailValidationSchema
>;

export type CancelOrderSchemaType = z.infer<typeof cancelOrderValidationSchema>;

export type GetOrderTrackingType = z.infer<
	typeof getOrderTrackingValidationSchema
>;

export type reorderOrderType = z.infer<typeof reorderOrderValidationSchema>;

// input types
export type EstimateOrderTotalInputType = EstimateOrderTotalSchemaType & {
	userId: string;
};

export type PlaceOrderFromCartInputType = PlaceOrderFromCartType & {
	userId: string;
};

export type ListCustomerOrdersInputType = ListCustomerOrdersSchemaType & {
	userId: string;
};

export type GetCustomerOrderDetailInputType =
	GetCustomerOrderDetailSchemaType & {
		userId: string;
	};

export type CancelOrderInputType = CancelOrderSchemaType & {
	userId: string;
};

export type GetOrderTrackingInputType = GetOrderTrackingType & {
	userId: string;
};

export type reorderOrderInputType = reorderOrderType & {
	userId: string;
};

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
		status: OrderStatusType;
		subtotal: number;
		shippingFee: number;
		taxAmount: number;
		totalAmount: number;
		notes: string | null;
		placedAt: string;
	};
	payment: {
		method: PaymentMethodType;
		status: PaymentStatusType;
		amount: number;
		paidAt: string | null;
	};
	shipping: {
		method: ShippingMethodType;
		carrier: ShippingCarrierType;
		status: ShippingStatusType;
		trackingNumber: string | null;
	};
	items: EstimatedOrderItemType[];
	itemCount: number;
};

export type ListCustomerOrdersOutputType = {
	items: CustomerOrderListItemType[];
	query: {
		status: "all" | "active" | "completed" | "cancelled";
		year?: number;
		searchOrderNumber?: string;
	};
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
};

export type GetCustomerOrderDetailOutputType = CustomerOrderDetailType;

export type CancelOrderOutputType = CustomerOrderDetailType;

export type GetOrderTrackingOutputType = {
	orderNumber: string;
	orderStatus: OrderStatusType;
	placedAt: string; // ← add this
	shipping: {
		carrier: ShippingCarrierType;
		method: ShippingMethodType;
		trackingNumber: string | null;
		status: ShippingStatusType;
		shippedAt: string | null;
		deliveredAt: string | null;
	};
	canTrack: boolean;
};

export type ReorderOrderOutputType = {
	addedCount: number;
	skippedCount: number;
	warnings: CartWarningType[];
};
