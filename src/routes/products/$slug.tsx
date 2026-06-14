import { createFileRoute } from "@tanstack/react-router";
import { ProductDetailPage } from "#/components/catalog/pages/product-detail-page";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";
import { getProductBySlugQueryOptions } from "#/queries/products.queries";

export const Route = createFileRoute("/products/$slug")({
	loader: ({ context: { queryClient }, params: { slug } }) =>
		queryClient
			.ensureQueryData(getProductBySlugQueryOptions({ slug }))
			.catch(() => null),
	component: RouteComponent,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});

function RouteComponent() {
	const { slug } = Route.useParams();
	return <ProductDetailPage slug={slug} />;
}
