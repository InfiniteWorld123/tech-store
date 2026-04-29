import type { z } from "zod";
import type {
	getAllOrdersValidationSchema,
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
	} | null;
	shipping: {
		id: string;
		carrier: ShippingCarrierType;
		method: ShippingMethodType;
		status: ShippingStatusType;
		trackingNumber: string | null;
	} | null;
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
