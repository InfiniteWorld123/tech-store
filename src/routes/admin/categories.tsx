import { createFileRoute } from "@tanstack/react-router";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { CategoriesPage } from "#/components/admin/pages/categories/categories-page.tsx";
import { listCategoriesSchema } from "#/server/catalog/categories/categories.schemas";
import { listCategoriesQueryOptions } from "../../queries/categories.queries.ts";

export const Route = createFileRoute("/admin/categories")({
	validateSearch: listCategoriesSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) =>
		context.queryClient.ensureQueryData(
			listCategoriesQueryOptions({
				searching: deps.searching,
			}),
		),
	component: CategoriesPage,
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
