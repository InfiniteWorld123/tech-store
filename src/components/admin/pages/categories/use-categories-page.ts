import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useDebouncedSearchParam } from "#/hooks/use-debounced-search-param";
import { listCategoriesQueryOptions } from "#/queries/categories.queries.ts";
import { Route } from "#/routes/admin/categories";

export function useCategoriesPage() {
	const { searching } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const commitSearch = useCallback(
		(value: string | undefined) => {
			navigate({
				search: (prev) => ({
					...prev,
					searching: {
						...prev.searching,
						search: value,
					},
				}),
			});
		},
		[navigate],
	);
	const { inputValue, setInputValue } = useDebouncedSearchParam({
		committedValue: searching?.search,
		onCommit: commitSearch,
	});

	const { data, isLoading, isError } = useQuery(
		listCategoriesQueryOptions({ searching }),
	);
	const items = data?.data.items ?? [];

	return {
		// search
		inputValue,
		setInputValue,
		// query
		items,
		isLoading,
		isError,
	};
}
