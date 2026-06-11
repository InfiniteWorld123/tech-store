import { queryOptions } from "@tanstack/react-query";
import { listOrdersAction } from "#/server/orders/admin/admin.actions";
import type { ListOrdersInputType } from "#/server/orders/admin/admin.types";

export const listOrdersQueryOptions = (data: ListOrdersInputType) =>
	queryOptions({
		queryKey: ["orders", data],
		queryFn: () => listOrdersAction({ data }),
	});
