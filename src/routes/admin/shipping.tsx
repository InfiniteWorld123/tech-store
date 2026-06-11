import { createFileRoute } from "@tanstack/react-router";
import { ShippingPage } from "#/components/admin/pages/shipping/shipping-page.tsx";
import { listShipmentsQueryOptions } from "#/queries/shipping.queries";
import { listShipmentsSchema } from "#/server/shipping/shipping.schemas";

export const Route = createFileRoute("/admin/shipping")({
	validateSearch: listShipmentsSchema,
	loaderDeps: ({ search }) => ({
		page: search.page,
		limit: search.limit,
		sortBy: search.sortBy,
		sortOrder: search.sortOrder,
		status: search.status,
		carrier: search.carrier,
		method: search.method,
		search: search.search,
		dateRange: {
			from: search.dateRange?.from,
			to: search.dateRange?.to,
		},
	}),
	loader: ({ context, deps }) =>
		context.queryClient.ensureQueryData(listShipmentsQueryOptions(deps)),
	component: ShippingPage,
});
