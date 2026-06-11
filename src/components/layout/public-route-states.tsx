import { Footer } from "#/components/layout/footer";
import { Header } from "#/components/layout/header";
import { PageError } from "#/components/ui/states/page-error";
import { PageLoading } from "#/components/ui/states/page-loading";

export function PublicRouteLoading() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1 pt-20">
				<PageLoading
					title="Loading page"
					description="Preparing the latest store content."
				/>
			</main>
			<Footer />
		</div>
	);
}

export function PublicRouteError({ error }: { error: Error }) {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1 pt-20">
				<PageError
					error={error}
					title="Page failed to load"
					description="Refresh the page or try again in a moment."
				/>
			</main>
			<Footer />
		</div>
	);
}
