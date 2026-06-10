import { queryOptions } from "@tanstack/react-query";
import { listCategoriesAction } from "#/server/catalog/categories/categories.actions";
import type { ListCategoriesInputType } from "#/server/catalog/categories/categories.types";

export const listCategoriesQueryOptions = (data: ListCategoriesInputType) =>
	queryOptions({
		queryKey: ["categories", data],
		queryFn: () => listCategoriesAction({ data }),
	});
