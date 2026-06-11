import { createFileRoute } from "@tanstack/react-router";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { ShippingPage } from "#/components/admin/pages/shipping/shipping-page.tsx";
import { listShipmentsQueryOptions } from "#/queries/shipping.queries";
import { listShipmentsSchema } from "#/server/shipping/shipping.schemas";

export const Route = createFileRoute("/admin/shipping")({
	validateSearch: listShipmentsSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) =>
		context.queryClient.ensureQueryData(listShipmentsQueryOptions(deps)),
	component: ShippingPage,
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
