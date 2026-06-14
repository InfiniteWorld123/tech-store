import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useDebouncedSearchParam } from "#/hooks/use-debounced-search-param";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { listShipmentsQueryOptions } from "#/queries/shipping.queries";
import { Route } from "#/routes/admin/shipping";
import type { ListShipmentsInputType } from "#/server/shipping/shipping.types";

export function useShippingPage() {
	const search = Route.useSearch();
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
	const { inputValue, setInputValue } = useDebouncedSearchParam({
		committedValue: search.search,
		onCommit: commitSearch,
	});

	const { data, isLoading, isError } = useQuery(
		listShipmentsQueryOptions(search),
	);

	const prefetchShipments = useCallback(
		(data: ListShipmentsInputType) => prefetch(listShipmentsQueryOptions(data)),
		[prefetch],
	);

	const withPageOne = useCallback(
		(data: Partial<ListShipmentsInputType>): ListShipmentsInputType => ({
			...search,
			...data,
			page: 1,
		}),
		[search],
	);

	const setStatus = (value: string) => {
		prefetchShipments(
			withPageOne({ status: (value as typeof search.status) || undefined }),
		);
		navigate({
			search: (prev) => ({
				...prev,
				status: (value as typeof search.status) || undefined,
				page: 1,
			}),
		});
	};

	const setCarrier = (value: string) => {
		prefetchShipments(
			withPageOne({ carrier: (value as typeof search.carrier) || undefined }),
		);
		navigate({
			search: (prev) => ({
				...prev,
				carrier: (value as typeof search.carrier) || undefined,
				page: 1,
			}),
		});
	};

	const setMethod = (value: string) => {
		prefetchShipments(
			withPageOne({ method: (value as typeof search.method) || undefined }),
		);
		navigate({
			search: (prev) => ({
				...prev,
				method: (value as typeof search.method) || undefined,
				page: 1,
			}),
		});
	};

	const setDateRange = ({ from, to }: { from?: string; to?: string }) => {
		prefetchShipments(withPageOne({ dateRange: { from, to } }));
		navigate({
			search: (prev) => ({
				...prev,
				dateRange: { from, to },
				page: 1,
			}),
		});
	};

	const setPage = (value: number) => {
		prefetchShipments({ ...search, page: value });
		navigate({ search: (prev) => ({ ...prev, page: value }) });
	};

	const prefetchPage = (value: number) => {
		if (value === search.page) return;
		prefetchShipments({ ...search, page: value });
	};

	const prefetchStatus = (value: string) =>
		prefetchShipments(
			withPageOne({ status: (value as typeof search.status) || undefined }),
		);
	const prefetchCarrier = (value: string) =>
		prefetchShipments(
			withPageOne({ carrier: (value as typeof search.carrier) || undefined }),
		);
	const prefetchMethod = (value: string) =>
		prefetchShipments(
			withPageOne({ method: (value as typeof search.method) || undefined }),
		);
	const prefetchDateRange = (value: { from?: string; to?: string }) =>
		prefetchShipments(withPageOne({ dateRange: value }));

	return {
		// search input (debounced)
		inputValue,
		setInputValue,
		// url filter state
		status: search.status,
		setStatus,
		carrier: search.carrier,
		setCarrier,
		method: search.method,
		setMethod,
		dateRange: search.dateRange,
		setDateRange,
		// pagination
		page: search.page,
		limit: search.limit,
		setPage,
		prefetchPage,
		prefetchStatus,
		prefetchCarrier,
		prefetchMethod,
		prefetchDateRange,
		// query
		items: data?.data.items ?? [],
		pagination: data?.data.pagination,
		isLoading,
		isError,
	};
}
