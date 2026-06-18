import { AllReviewsPanel } from "./sections/all-reviews-panel";
import { ReviewsOverview } from "./sections/reviews-overview";

export function ReviewsPage() {
	return (
		<div className="space-y-4 py-4 sm:space-y-6 sm:py-6">
			{/* ── Overview ── */}
			<ReviewsOverview />

			{/* ── Reviews Table ── */}
			<AllReviewsPanel />
		</div>
	);
}
