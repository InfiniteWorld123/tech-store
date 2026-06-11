import { PageError } from "#/components/ui/states/page-error";
import { PageLoading } from "#/components/ui/states/page-loading";

export function AuthRouteLoading() {
	return (
		<PageLoading
			title="Loading"
			description="Preparing the authentication page."
			className="min-h-96"
		/>
	);
}

export function AuthRouteError({ error }: { error: Error }) {
	return (
		<PageError
			error={error}
			title="Authentication page failed to load"
			description="Refresh the page or try again in a moment."
			className="min-h-96"
		/>
	);
}
