import { createFileRoute } from "@tanstack/react-router";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { ProductsPage } from "#/components/admin/pages/products/products-page.tsx";

export const Route = createFileRoute("/admin/products")({
	component: ProductsPage,
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
