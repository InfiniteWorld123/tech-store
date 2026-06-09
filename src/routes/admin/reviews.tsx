import { createFileRoute } from "@tanstack/react-router";
import { ReviewsPage } from "#/components/admin/pages/reviews/reviews-page.tsx";
import {
	useGetReviewMetricsQueryOptions,
	useListAllReviewsQueryOptions,
} from "#/hooks/reviews.hook";
import { listAllReviewsSchema } from "../../server/reviews/reviews.schemas.ts"

export const Route = createFileRoute("/admin/reviews")({
	validateSearch: listAllReviewsSchema,
	loaderDeps: ({ search }) => ({
		page: search.page,
		limit: search.limit,
		search: search.search,
		rating: search.rating,
	}),
	loader: ({ context, deps }) => Promise.all([
		context.queryClient.ensureQueryData(useListAllReviewsQueryOptions(deps)),
		context.queryClient.ensureQueryData(useGetReviewMetricsQueryOptions()),
	]),
	component: ReviewsPage,
	pendingComponent: () => <div></div>,
	errorComponent: () => <div></div>,
});
