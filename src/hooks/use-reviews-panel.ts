import { listAllReviewsQueryOptions } from "#/queries";
import { Route } from "#/routes/admin/reviews";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useDeferredValue, useEffect, useState } from "react";

export function useReviewsPanel() {
    const { search, rating, page, limit } = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });

    const [inputValue, setInputValue] = useState(search ?? "");
    const deferredSearch = useDeferredValue(search);
    const isStale = search !== deferredSearch;

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate({ search: (prev) => ({ ...prev, search: inputValue || undefined, page: 1 }) });
        }, 400);
        return () => clearTimeout(timer);
    }, [inputValue]);

    const { data, isLoading, isError } = useQuery(
        listAllReviewsQueryOptions({ search: deferredSearch, rating, page, limit })
    );

    const setRating = (value: number | undefined) =>
        navigate({ search: (prev) => ({ ...prev, rating: value, page: 1 }) });

    const setPage = (value: number) =>
        navigate({ search: (prev) => ({ ...prev, page: value }) });

    const queryClient = useQueryClient();

    const prefetchPage = (targetPage: number) =>
        queryClient.prefetchQuery(
            listAllReviewsQueryOptions({ search, rating, page: targetPage, limit })
        );

    const prefetchRating = (value: number | undefined) =>
        queryClient.prefetchQuery(
            listAllReviewsQueryOptions({ search, rating: value, page: 1, limit })
        );

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
        prefetchRating
    };
}