import { Star } from "lucide-react";
import {
	AdminEmptyState,
	AdminPageHeader,
} from "#/components/admin/sections/admin-page";

export function ReviewsPage() {
	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader
				title="Reviews"
				description="Moderate customer reviews"
			/>
			<AdminEmptyState icon={Star} message="Review moderation coming soon." />
		</div>
	);
}
