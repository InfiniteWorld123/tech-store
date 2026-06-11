import { queryOptions } from "@tanstack/react-query";
import {
	getShippingAction,
	listShipmentsAction,
} from "#/server/shipping/shipping.actions";
import type {
	GetShippingInputType,
	ListShipmentsInputType,
} from "#/server/shipping/shipping.types";

export const listShipmentsQueryOptions = (data: ListShipmentsInputType) =>
	queryOptions({
		queryKey: [
			"shipments",
			data.status,
			data.carrier,
			data.method,
			data.search,
			data.dateRange,
			data.page,
			data.limit,
			data.sortBy,
			data.sortOrder,
		],
		queryFn: () => listShipmentsAction({ data }),
	});

export const getShippingQueryOptions = (data: GetShippingInputType) =>
	queryOptions({
		queryKey: ["shipments", "detail", data.orderId],
		queryFn: () => getShippingAction({ data }),
	});
