import type {
	ListShipmentsOutputType,
	ShippingCarrierType,
	ShippingMethodType,
	ShippingStatusType,
} from "#/server/shipping/shipping.types";

export type ShippingListItem = ListShipmentsOutputType["items"][number];
export type ShippingCarrier = ShippingCarrierType;
export type ShippingMethod = ShippingMethodType;
export type ShippingStatus = ShippingStatusType;
