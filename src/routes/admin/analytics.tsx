import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsPage } from "#/components/admin/pages/analytics/analytics-page";
import { 
	useGetOrderMetricsQueryOptions,
	useGetPaymentsMetricsQueryOptions,
	useGetProductMetricsQueryOptions,
	useGetCustomerMetricsQueryOptions,
	useGetReviewMetricsQueryOptions,
	useGetShippingMetricsQueryOptions,
	useGetCartMetricsQueryOptions,
} from "#/hooks/analytics.hook";

export const Route = createFileRoute("/admin/analytics")({
	component: AnalyticsPage,
	loader: ({ context }) => Promise.all([
		context.queryClient.ensureQueryData(useGetOrderMetricsQueryOptions()),
		context.queryClient.ensureQueryData(useGetPaymentsMetricsQueryOptions()),
		context.queryClient.ensureQueryData(useGetProductMetricsQueryOptions()),
		context.queryClient.ensureQueryData(useGetOrderMetricsQueryOptions()),
		context.queryClient.ensureQueryData(useGetCustomerMetricsQueryOptions()),
		context.queryClient.ensureQueryData(useGetReviewMetricsQueryOptions()),
		context.queryClient.ensureQueryData(useGetShippingMetricsQueryOptions()),
		context.queryClient.ensureQueryData(useGetCartMetricsQueryOptions()),
	]),
});
