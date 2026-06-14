import { queryOptions } from "@tanstack/react-query";
import type { z } from "zod";
import { listOrdersAction } from "#/server/orders/admin/admin.actions";
import type { ListOrdersInputType } from "#/server/orders/admin/admin.types";
import {
	estimateOrderTotalAction,
	getCustomerOrderDetailAction,
	getOrderTrackingAction,
	listCustomerOrdersAction,
} from "#/server/orders/customer/customer.actions";
import type {
	estimateOrderTotalSchema,
	listCustomerOrdersSchema,
} from "#/server/orders/customer/customer.schemas";

export const listOrdersQueryOptions = (data: ListOrdersInputType) =>
	queryOptions({
		queryKey: ["orders", data],
		queryFn: () => listOrdersAction({ data }),
	});

export const listCustomerOrdersQueryOptions = (
	data: z.infer<typeof listCustomerOrdersSchema>,
) =>
	queryOptions({
		queryKey: ["orders", "customer", "list", data],
		queryFn: () => listCustomerOrdersAction({ data }),
	});

export const getCustomerOrderDetailQueryOptions = ({
	orderId,
}: {
	orderId: string;
}) =>
	queryOptions({
		queryKey: ["orders", "customer", "detail", orderId],
		queryFn: () => getCustomerOrderDetailAction({ data: { orderId } }),
	});

export const getOrderTrackingQueryOptions = ({
	orderId,
}: {
	orderId: string;
}) =>
	queryOptions({
		queryKey: ["orders", "customer", "tracking", orderId],
		queryFn: () => getOrderTrackingAction({ data: { orderId } }),
	});

export const estimateOrderTotalQueryOptions = (
	data: z.infer<typeof estimateOrderTotalSchema>,
) =>
	queryOptions({
		queryKey: ["orders", "estimate", data],
		queryFn: () => estimateOrderTotalAction({ data }),
	});
