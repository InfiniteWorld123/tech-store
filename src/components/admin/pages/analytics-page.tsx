import {
	AdminPageHeader,
	AdminPlaceholderCard,
} from "#/components/admin/sections/admin-page";

export function AnalyticsPage() {
	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader
				title="Analytics"
				description="Store performance overview"
			/>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<AdminPlaceholderCard>Revenue chart coming soon</AdminPlaceholderCard>
				<AdminPlaceholderCard>
					Orders by status coming soon
				</AdminPlaceholderCard>
			</div>
			<AdminPlaceholderCard>Traffic overview coming soon</AdminPlaceholderCard>
		</div>
	);
}
