import { createFileRoute } from "@tanstack/react-router";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { DashboardPage } from "#/components/admin/pages/dashboard/dashboard-page.tsx";

export const Route = createFileRoute("/admin/")({
	component: DashboardPage,
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
