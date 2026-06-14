import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { OrdersPage } from "#/components/account/pages/orders-page";
import { listCustomerOrdersQueryOptions } from "#/queries/orders.queries";

const searchSchema = z.object({
	status: z.enum(["all", "active", "completed", "cancelled"]).default("all"),
	page: z.number().int().min(1).default(1),
	searchOrderNumber: z.string().trim().min(1).max(100).optional(),
});

export const Route = createFileRoute("/account/orders")({
	validateSearch: searchSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ context: { queryClient }, deps }) =>
		queryClient
			.ensureQueryData(
				listCustomerOrdersQueryOptions({
					status: deps.status,
					page: deps.page,
					limit: 10,
					searchOrderNumber: deps.searchOrderNumber,
				}),
			)
			.catch(() => null),
	component: OrdersPage,
});
