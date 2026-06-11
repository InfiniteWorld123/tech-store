import { PageError } from "#/components/ui/states/page-error";
import { PageLoading } from "#/components/ui/states/page-loading";

export function AdminRouteLoading() {
	return (
		<PageLoading
			title="Loading admin page"
			description="Preparing the latest admin data."
			className="min-h-full"
		/>
	);
}

export function AdminRouteError({ error }: { error: Error }) {
	return (
		<PageError
			error={error}
			title="Admin page failed to load"
			description="Refresh the admin data or try again in a moment."
			className="min-h-full"
		/>
	);
}
