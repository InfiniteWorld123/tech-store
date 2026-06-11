import { createFileRoute } from "@tanstack/react-router";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { VariantsPage } from "#/components/admin/pages/variants/variants-page.tsx";

export const Route = createFileRoute("/admin/variants")({
	component: VariantsPage,
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
