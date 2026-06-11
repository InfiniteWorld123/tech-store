import { createFileRoute } from "@tanstack/react-router";
import { CategoryDetailPage } from "#/components/catalog/pages/category-detail-page";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";

export const Route = createFileRoute("/categories/$slug")({
	component: RouteComponent,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});

function RouteComponent() {
	const { slug } = Route.useParams();
	return <CategoryDetailPage slug={slug} />;
}
