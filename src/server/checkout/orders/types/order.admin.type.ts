import type { z } from "zod";
import type {
	getAllOrdersValidationSchema,
	getOrderDetailValidationSchema,
	orderStatusSchema,
	paymentMethodSchema,
	paymentStatusSchema,
	shippingCarrierSchema,
	shippingMethodSchema,
	shippingStatusSchema,
} from "../validation/order.admin.validation";

export type GetAllOrdersInputType = z.infer<
	typeof getAllOrdersValidationSchema
>;

export type GetOrderDetailInputType = z.infer<
	typeof getOrderDetailValidationSchema
>;

export type OrderStatusType = z.infer<typeof orderStatusSchema>;

export type PaymentStatusType = z.infer<typeof paymentStatusSchema>;

export type PaymentMethodType = z.infer<typeof paymentMethodSchema>;

export type ShippingStatusType = z.infer<typeof shippingStatusSchema>;

export type ShippingMethodType = z.infer<typeof shippingMethodSchema>;

export type ShippingCarrierType = z.infer<typeof shippingCarrierSchema>;

export type AdminOrderListItemType = {
	id: string;
	userId: string;
	addressId: string;
	orderNumber: string;
	status: OrderStatusType;
	subtotal: number;
	shippingFee: number;
	taxAmount: number;
	totalAmount: number;
	notes: string | null;
	placedAt: string;
	createdAt: string;
	updatedAt: string;
	customer: {
		id: string;
		name: string;
		email: string;
	};
	payment: {
		id: string;
		method: PaymentMethodType;
		status: PaymentStatusType;
		amount: number;
		paidAt: string | null;
	};
	shipping: {
		id: string;
		carrier: ShippingCarrierType;
		method: ShippingMethodType;
		status: ShippingStatusType;
		trackingNumber: string | null;
	};
	itemCount: number;
};

export type AdminOrderDetailItemType = {
	id: string;
	variantId: string;
	productName: string;
	variantName: string;
	sku: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
};

export type AdminOrderDetailType = Omit<AdminOrderListItemType, "itemCount"> & {
	address: {
		id: string;
		fullName: string;
		phone: string;
		street: string;
		postalCode: string;
		city: string;
		state: string | null;
		country: string;
	};
	payment: AdminOrderListItemType["payment"] & {
		createdAt: string;
		updatedAt: string;
	};
	shipping: AdminOrderListItemType["shipping"] & {
		shippedAt: string | null;
		deliveredAt: string | null;
		createdAt: string;
		updatedAt: string;
	};
	items: AdminOrderDetailItemType[];
	itemCount: number;
};

export type GetAllOrdersOutputType = {
	items: AdminOrderListItemType[];
	query: {
		searching?: GetAllOrdersInputType["searching"];
		sorting?: GetAllOrdersInputType["sorting"];
		filters?: GetAllOrdersInputType["filters"];
		flags?: GetAllOrdersInputType["flags"];
		ranges?: GetAllOrdersInputType["ranges"];
	};
	pagination: {
		page: GetAllOrdersInputType["pagination"]["page"];
		limit: GetAllOrdersInputType["pagination"]["limit"];
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
};

export type GetOrderDetailOutputType = {
	item: AdminOrderDetailType;
};
