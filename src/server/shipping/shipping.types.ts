import type { z } from "zod";
import type {
	addTrackingNumberSchema,
	createShippingSchema,
	getShippingSchema,
	listShipmentsSchema,
	markOrderDeliveredSchema,
	markOrderShippedSchema,
	shippingCarrierSchema,
	shippingMethodSchema,
	shippingStatusSchema,
	updateShippingStatusSchema,
} from "./shipping.schemas";

export type ShippingCarrierType = z.infer<typeof shippingCarrierSchema>;

export type ShippingMethodType = z.infer<typeof shippingMethodSchema>;

export type ShippingStatusType = z.infer<typeof shippingStatusSchema>;

export type ShippingType = {
	id: string;
	orderId: string;
	carrier: ShippingCarrierType;
	method: ShippingMethodType;
	trackingNumber: string | null;
	status: ShippingStatusType;
	shippedAt: string | null;
	deliveredAt: string | null;
	createdAt: string;
	updatedAt: string;
};

export type CreateShippingInputType = z.infer<typeof createShippingSchema>;

export type GetShippingInputType = z.infer<typeof getShippingSchema>;

export type UpdateShippingStatusInputType = z.infer<
	typeof updateShippingStatusSchema
>;

export type AddTrackingNumberInputType = z.infer<
	typeof addTrackingNumberSchema
>;

export type MarkOrderShippedInputType = z.infer<typeof markOrderShippedSchema>;

export type MarkOrderDeliveredInputType = z.infer<
	typeof markOrderDeliveredSchema
>;

export type CreateShippingOutputType = {
	shipping: ShippingType;
};

export type GetShippingOutputType = {
	shipping: ShippingType;
};

export type UpdateShippingStatusOutputType = {
	orderId: string;
	orderShippingStatus: ShippingStatusType;
};

export type AddTrackingNumberOutputType = {
	shipping: ShippingType;
};

export type MarkOrderShippedOutputType = {
	orderId: string;
	orderStatus: "pending" | "processing" | "completed" | "cancelled";
	shippingStatus: ShippingStatusType;
	trackingNumber: string;
	shippedAt: string;
};

export type MarkOrderDeliveredOutputType = {
	orderId: string;
	orderStatus: "pending" | "processing" | "completed" | "cancelled";
	shippingStatus: ShippingStatusType;
	deliveredAt: string;
};

export type ListShipmentsInputType = z.infer<typeof listShipmentsSchema>;

export type ListShipmentsOutputType = {
	items: ShippingListItemType[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
	query: {
		status?: ListShipmentsInputType["status"];
		carrier?: ListShipmentsInputType["carrier"];
		method?: ListShipmentsInputType["method"];
		search?: string;
		dateRange?: { from?: string; to?: string };
		sortBy: ListShipmentsInputType["sortBy"];
		sortOrder: ListShipmentsInputType["sortOrder"];
	};
};

export type ShippingListItemType = {
	id: string;
	orderId: string;
	orderNumber: string;
	carrier: ShippingCarrierType;
	method: ShippingMethodType;
	trackingNumber: string | null;
	status: ShippingStatusType;
	shippedAt: string | null;
	deliveredAt: string | null;
	createdAt: string;
	updatedAt: string;
};
