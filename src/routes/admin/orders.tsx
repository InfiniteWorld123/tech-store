import { createFileRoute } from "@tanstack/react-router";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { OrdersPage } from "#/components/admin/pages/orders/orders-page.tsx";
import { listOrdersQueryOptions } from "#/queries/orders.queries";
import { listOrdersSchema } from "#/server/orders/admin/admin.schemas";

export const Route = createFileRoute("/admin/orders")({
	validateSearch: listOrdersSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) =>
		context.queryClient.ensureQueryData(listOrdersQueryOptions(deps)),
	component: OrdersPage,
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
