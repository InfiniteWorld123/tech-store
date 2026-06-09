import { queryOptions } from "@tanstack/react-query";
import { listCategoriesAction } from "#/server/catalog/categories/categories.actions";

// src/queries/categories.queries.ts
export const useCategoriesQueryOptions = queryOptions({
	queryKey: ["categories"],
	queryFn: () => listCategoriesAction({ data: {} }),
});
