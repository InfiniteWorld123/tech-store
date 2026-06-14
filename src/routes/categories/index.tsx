import { createFileRoute } from "@tanstack/react-router";
import { CategoriesPage } from "#/components/catalog/pages/categories-page";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";
import { listCategoriesQueryOptions } from "#/queries/categories.queries";

export const Route = createFileRoute("/categories/")({
	loader: ({ context: { queryClient } }) =>
		queryClient
			.ensureQueryData(listCategoriesQueryOptions({}))
			.catch(() => null),
	component: CategoriesPage,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
