import { createFileRoute } from "@tanstack/react-router";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { InventoryPage } from "#/components/admin/pages/inventory/inventory-page.tsx";

export const Route = createFileRoute("/admin/inventory")({
	component: InventoryPage,
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
