import { createFileRoute } from "@tanstack/react-router";
import { ReviewsPage } from "#/components/account/pages/reviews-page";
import { listMyReviewsQueryOptions } from "#/queries/reviews.queries";

export const Route = createFileRoute("/account/reviews")({
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(listMyReviewsQueryOptions()).catch(() => null),
	component: ReviewsPage,
});
