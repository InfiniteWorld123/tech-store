import { AllReviewsPanel } from "./sections/all-reviews-panel";
import { ReviewsOverview } from "./sections/reviews-overview";

export function ReviewsPage() {
	return (
		<div className="py-6 space-y-6">
			{/* ── Overview ── */}
			<ReviewsOverview />

			{/* ── Reviews Table ── */}
			<AllReviewsPanel />
		</div>
	);
}
