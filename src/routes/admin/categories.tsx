import { createFileRoute } from "@tanstack/react-router";
import { CategoriesError } from "#/components/admin/pages/categories/categories-error";
import { CategoriesPage } from "#/components/admin/pages/categories/categories-page.tsx";
import { listCategoriesSchema } from "#/server/catalog/categories/categories.schemas";
import { listCategoriesQueryOptions } from "../../queries/categories.queries.ts";

export const Route = createFileRoute("/admin/categories")({
	validateSearch: listCategoriesSchema,
	loaderDeps: ({ search }) => ({
		searching: search.searching,
	}),
	loader: ({ context, deps }) =>
		context.queryClient.ensureQueryData(
			listCategoriesQueryOptions({
				searching: deps.searching,
			}),
		),
	component: CategoriesPage,
	errorComponent: ({ error }) => <CategoriesError error={error as Error} />,
});
