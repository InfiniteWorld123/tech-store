import {
	AdminPageHeader,
	AdminPlaceholderCard,
} from "#/components/admin/sections/admin-page";

export function DashboardPage() {
	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader title="Dashboard" />
			<AdminPlaceholderCard>
				Dashboard widgets will appear here once store metrics are connected.
			</AdminPlaceholderCard>
		</div>
	);
}
