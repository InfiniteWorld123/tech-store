import { createFileRoute } from "@tanstack/react-router";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { AnalyticsPage } from "#/components/admin/pages/analytics/analytics-page";
import {
	cartMetricsQueryOptions,
	customerMetricsQueryOptions,
	orderMetricsQueryOptions,
	paymentsMetricsQueryOptions,
	productMetricsQueryOptions,
	reviewMetricsQueryOptions,
	shippingMetricsQueryOptions,
} from "#/queries/analytics.queries.ts";

export const Route = createFileRoute("/admin/analytics")({
	component: AnalyticsPage,
	loader: ({ context }) =>
		Promise.all([
			context.queryClient.ensureQueryData(orderMetricsQueryOptions()),
			context.queryClient.ensureQueryData(paymentsMetricsQueryOptions()),
			context.queryClient.ensureQueryData(productMetricsQueryOptions()),
			context.queryClient.ensureQueryData(orderMetricsQueryOptions()),
			context.queryClient.ensureQueryData(customerMetricsQueryOptions()),
			context.queryClient.ensureQueryData(reviewMetricsQueryOptions()),
			context.queryClient.ensureQueryData(shippingMetricsQueryOptions()),
			context.queryClient.ensureQueryData(cartMetricsQueryOptions()),
		]),
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
