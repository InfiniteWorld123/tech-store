import { queryOptions } from "@tanstack/react-query";
import {
	getPaymentAction,
	listPaymentsAction,
} from "#/server/payments/payments.actions";
import type { ListPaymentsInputType } from "#/server/payments/payments.types";

export const getPaymentQueryOptions = (data: { orderId: string }) =>
	queryOptions({
		queryKey: ["payments", "detail", data.orderId],
		queryFn: () => getPaymentAction({ data }),
	});

export const listPaymentsQueryOptions = (data: ListPaymentsInputType) =>
	queryOptions({
		queryKey: [
			"payments",
			data.status,
			data.method,
			data.search,
			data.dateRange,
			data.page,
			data.limit,
			data.sortBy,
			data.sortOrder,
		],
		queryFn: () => listPaymentsAction({ data }),
	});
