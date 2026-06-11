import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "#/components/catalog/pages/products-page";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";

export const Route = createFileRoute("/products/")({
	component: ProductsPage,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
