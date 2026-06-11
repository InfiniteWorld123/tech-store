import { createFileRoute } from "@tanstack/react-router";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { ReviewsPage } from "#/components/admin/pages/reviews/reviews-page.tsx";
import { reviewMetricsQueryOptions } from "../../queries/analytics.queries.ts";
import { listAllReviewsQueryOptions } from "../../queries/reviews.queries.ts";
import { listAllReviewsSchema } from "../../server/reviews/reviews.schemas.ts";

export const Route = createFileRoute("/admin/reviews")({
	validateSearch: listAllReviewsSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) =>
		Promise.all([
			context.queryClient.ensureQueryData(listAllReviewsQueryOptions(deps)),
			context.queryClient.ensureQueryData(reviewMetricsQueryOptions()),
		]),
	component: ReviewsPage,
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
