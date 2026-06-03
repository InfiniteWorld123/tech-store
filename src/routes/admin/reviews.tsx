import { createFileRoute } from "@tanstack/react-router";
import { ReviewsPage } from "#/components/admin/pages/reviews-page";

export const Route = createFileRoute("/admin/reviews")({
	component: ReviewsPage,
});
