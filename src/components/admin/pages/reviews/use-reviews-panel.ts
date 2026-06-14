import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useDebouncedSearchParam } from "#/hooks/use-debounced-search-param";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { listAllReviewsQueryOptions } from "#/queries/reviews.queries";
import { Route } from "#/routes/admin/reviews";

export function useReviewsPanel() {
	const { search, rating, page, limit } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { prefetch } = useQueryIntentPrefetch();

	const commitSearch = useCallback(
		(value: string | undefined) => {
			navigate({
				search: (prev) => ({
					...prev,
					search: value,
					page: 1,
				}),
			});
		},
		[navigate],
	);
	const {
		inputValue,
		setInputValue,
		isPending: isStale,
	} = useDebouncedSearchParam({
		committedValue: search,
		onCommit: commitSearch,
	});

	const { data, isLoading, isError } = useQuery(
		listAllReviewsQueryOptions({ search, rating, page, limit }),
	);

	const prefetchReviews = useCallback(
		(data: {
			limit?: number;
			page?: number;
			search?: string;
			rating?: number;
		}) => prefetch(listAllReviewsQueryOptions(data)),
		[prefetch],
	);

	const setRating = (value: number | undefined) => {
		prefetchReviews({ search, rating: value, page: 1, limit });
		navigate({ search: (prev) => ({ ...prev, rating: value, page: 1 }) });
	};

	const setPage = (value: number) => {
		prefetchReviews({ search, rating, page: value, limit });
		navigate({ search: (prev) => ({ ...prev, page: value }) });
	};

	const prefetchPage = (targetPage: number) => {
		if (targetPage === page) return;
		prefetchReviews({ search, rating, page: targetPage, limit });
	};

	const prefetchRating = (value: number | undefined) =>
		prefetchReviews({ search, rating: value, page: 1, limit });

	return {
		// filters
		inputValue,
		setInputValue,
		rating,
		setRating,
		// pagination
		page,
		limit,
		setPage,
		// query
		data,
		isLoading,
		isError,
		isStale,
		prefetchPage,
		prefetchRating,
	};
}
