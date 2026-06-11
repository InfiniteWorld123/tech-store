import { createFileRoute } from "@tanstack/react-router";
import { CategoriesPage } from "#/components/catalog/pages/categories-page";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";

export const Route = createFileRoute("/categories/")({
	component: CategoriesPage,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
