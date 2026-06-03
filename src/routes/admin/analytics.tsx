import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsPage } from "#/components/admin/pages/analytics-page";

export const Route = createFileRoute("/admin/analytics")({
	component: AnalyticsPage,
});
