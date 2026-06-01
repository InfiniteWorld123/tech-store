import { listCategoriesAction } from "#/server/catalog/categories/categories.actions";
import { queryOptions } from "@tanstack/react-query";

// src/queries/categories.queries.ts
export const categoriesQueryOptions = queryOptions({
    queryKey: ["categories"],
    queryFn: () => listCategoriesAction({ data: {} }),
});