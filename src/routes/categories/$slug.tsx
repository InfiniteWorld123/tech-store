import { createFileRoute } from "@tanstack/react-router";
import { CategoryDetailPage } from "#/components/catalog/pages/category-detail-page";

export const Route = createFileRoute("/categories/$slug")({
	component: RouteComponent,
});

function RouteComponent() {
	const { slug } = Route.useParams();
	return <CategoryDetailPage slug={slug} />;
}
