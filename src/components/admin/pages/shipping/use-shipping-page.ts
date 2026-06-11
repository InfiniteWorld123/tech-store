import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listShipmentsQueryOptions } from "#/queries/shipping.queries";
import { Route } from "#/routes/admin/shipping";

export function useShippingPage() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const [inputValue, setInputValue] = useState(search.search ?? "");

	useEffect(() => {
		const timer = window.setTimeout(() => {
			navigate({
				search: (prev) => ({
					...prev,
					search: inputValue.trim() || undefined,
					page: 1,
				}),
			});
		}, 400);
		return () => window.clearTimeout(timer);
	}, [inputValue, navigate]);

	const { data, isLoading, isError } = useQuery(
		listShipmentsQueryOptions(search),
	);

	const setStatus = (value: string) =>
		navigate({
			search: (prev) => ({
				...prev,
				status: (value as typeof search.status) || undefined,
				page: 1,
			}),
		});

	const setCarrier = (value: string) =>
		navigate({
			search: (prev) => ({
				...prev,
				carrier: (value as typeof search.carrier) || undefined,
				page: 1,
			}),
		});

	const setMethod = (value: string) =>
		navigate({
			search: (prev) => ({
				...prev,
				method: (value as typeof search.method) || undefined,
				page: 1,
			}),
		});

	const setDateRange = ({ from, to }: { from?: string; to?: string }) =>
		navigate({
			search: (prev) => ({
				...prev,
				dateRange: { from, to },
				page: 1,
			}),
		});

	const setPage = (value: number) =>
		navigate({ search: (prev) => ({ ...prev, page: value }) });

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
		// query
		items: data?.data.items ?? [],
		pagination: data?.data.pagination,
		isLoading,
		isError,
	};
}
