import { createFileRoute } from "@tanstack/react-router";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { SettingsPage } from "#/components/admin/pages/settings/settings-page.tsx";

export const Route = createFileRoute("/admin/settings")({
	component: SettingsPage,
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
