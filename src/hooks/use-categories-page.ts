import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listCategoriesQueryOptions } from "#/queries/categories.queries.ts";
import { Route } from "#/routes/admin/categories";

export function useCategoriesPage() {
	const { searching } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const [inputValue, setInputValue] = useState(searching?.search ?? "");

	// Debounce: push the search value into the URL after 400ms of no typing
	useEffect(() => {
		const timer = setTimeout(() => {
			navigate({
				search: (prev) => ({
					...prev,
					searching: {
						...prev.searching,
						search: inputValue || undefined,
					},
				}),
			});
		}, 400);
		return () => clearTimeout(timer);
	}, [inputValue, navigate]);

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
