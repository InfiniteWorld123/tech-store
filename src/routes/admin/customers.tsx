import { createFileRoute } from "@tanstack/react-router";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { CustomersPage } from "#/components/admin/pages/customers/customers-page.tsx";

export const Route = createFileRoute("/admin/customers")({
	component: CustomersPage,
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
