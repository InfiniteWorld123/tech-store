import type {
	ListOrdersOutputType,
	OrderStatusType,
	PaymentStatusType,
	ShippingCarrierType,
	ShippingStatusType,
} from "#/server/orders/admin/admin.types";

export type OrderListItem = ListOrdersOutputType["items"][number];
export type OrderStatus = OrderStatusType;
export type OrderPaymentStatus = PaymentStatusType;
export type OrderShippingStatus = ShippingStatusType;
export type OrderShippingCarrier = ShippingCarrierType;
