import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useDebouncedSearchParam } from "#/hooks/use-debounced-search-param";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { listOrdersQueryOptions } from "#/queries/orders.queries";
import { Route } from "#/routes/admin/orders";
import type { ListOrdersInputType } from "#/server/orders/admin/admin.types";

const LIMIT = 10;

type OrderFilters = NonNullable<ListOrdersInputType["filters"]>;
type OrderRanges = NonNullable<ListOrdersInputType["ranges"]>;
type OrderStatus = OrderFilters["orderStatuses"][number];
type PaymentStatus = OrderFilters["paymentStatuses"][number];
type ShippingStatus = OrderFilters["shippingStatuses"][number];
type ShippingCarrier = OrderFilters["carriers"][number];

const emptyFilters = (
	filters?: ListOrdersInputType["filters"],
): OrderFilters => ({
	orderStatuses: filters?.orderStatuses ?? [],
	paymentStatuses: filters?.paymentStatuses ?? [],
	shippingStatuses: filters?.shippingStatuses ?? [],
	paymentMethods: filters?.paymentMethods ?? [],
	shippingMethods: filters?.shippingMethods ?? [],
	carriers: filters?.carriers ?? [],
});

const toInputDate = (value: Date | string | undefined) => {
	if (!value) return "";
	return new Date(value).toISOString().slice(0, 10);
};

const toDate = (value: string, endOfDay = false) => {
	if (!value) return undefined;
	return new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`);
};

export function useOrdersPage() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { prefetch } = useQueryIntentPrefetch();

	const commitSearch = useCallback(
		(value: string | undefined) => {
			navigate({
				search: (prev) => ({
					...prev,
					searching: value
						? {
								search: value,
								searchType: prev.searching?.searchType,
							}
						: undefined,
					pagination: {
						page: 1,
						limit: prev.pagination?.limit ?? LIMIT,
					},
				}),
			});
		},
		[navigate],
	);
	const { inputValue, setInputValue } = useDebouncedSearchParam({
		committedValue: search.searching?.search,
		onCommit: commitSearch,
	});

	const { data, isLoading, isError } = useQuery(listOrdersQueryOptions(search));
	const items = data?.data.items ?? [];
	const pagination = data?.data.pagination ?? {
		page: search.pagination.page,
		limit: search.pagination.limit,
		total: 0,
		totalPages: 1,
		hasNextPage: false,
		hasPreviousPage: false,
	};

	const filters = emptyFilters(search.filters);
	const placedAtRange = search.ranges?.placedAtRange;
	const dateFrom = toInputDate(placedAtRange?.from);
	const dateTo = toInputDate(placedAtRange?.to);

	const prefetchOrders = useCallback(
		(data: ListOrdersInputType) => prefetch(listOrdersQueryOptions(data)),
		[prefetch],
	);

	const withFilters = useCallback(
		(filters: OrderFilters): ListOrdersInputType => ({
			...search,
			filters,
			pagination: {
				page: 1,
				limit: search.pagination?.limit ?? LIMIT,
			},
		}),
		[search],
	);

	const withRanges = useCallback(
		(ranges: OrderRanges | undefined): ListOrdersInputType => ({
			...search,
			ranges,
			pagination: {
				page: 1,
				limit: search.pagination?.limit ?? LIMIT,
			},
		}),
		[search],
	);

	const setFilters = (filters: OrderFilters) => {
		prefetchOrders(withFilters(filters));
		navigate({
			search: (prev) => ({
				...prev,
				filters,
				pagination: {
					page: 1,
					limit: prev.pagination?.limit ?? LIMIT,
				},
			}),
		});
	};

	const setRanges = (ranges: OrderRanges | undefined) => {
		prefetchOrders(withRanges(ranges));
		navigate({
			search: (prev) => ({
				...prev,
				ranges,
				pagination: {
					page: 1,
					limit: prev.pagination?.limit ?? LIMIT,
				},
			}),
		});
	};

	const setPage = (page: number) => {
		prefetchOrders({
			...search,
			pagination: {
				...search.pagination,
				page,
				limit: search.pagination?.limit ?? LIMIT,
			},
		});
		navigate({
			search: (prev) => ({
				...prev,
				pagination: {
					...prev.pagination,
					page,
					limit: prev.pagination?.limit ?? LIMIT,
				},
			}),
		});
	};

	const prefetchPage = (page: number) => {
		if (page === pagination.page) return;
		prefetchOrders({
			...search,
			pagination: {
				...search.pagination,
				page,
				limit: search.pagination?.limit ?? LIMIT,
			},
		});
	};

	const prefetchOrderStatus = (v: string) =>
		prefetchOrders(
			withFilters({
				...filters,
				orderStatuses: v ? [v as OrderStatus] : [],
			}),
		);
	const prefetchPaymentStatus = (v: string) =>
		prefetchOrders(
			withFilters({
				...filters,
				paymentStatuses: v ? [v as PaymentStatus] : [],
			}),
		);
	const prefetchShippingStatus = (v: string) =>
		prefetchOrders(
			withFilters({
				...filters,
				shippingStatuses: v ? [v as ShippingStatus] : [],
			}),
		);
	const prefetchCarrier = (v: string) =>
		prefetchOrders(
			withFilters({
				...filters,
				carriers: v ? [v as ShippingCarrier] : [],
			}),
		);
	const prefetchDateFrom = (v: string) => {
		if (!v) return;
		const nextPlacedAtRange = {
			from: toDate(v),
			to: toDate(dateTo, true),
		};
		prefetchOrders(
			withRanges({
				...search.ranges,
				placedAtRange: nextPlacedAtRange,
			}),
		);
	};
	const prefetchDateTo = (v: string) => {
		if (!v) return;
		const nextPlacedAtRange = {
			from: toDate(dateFrom),
			to: toDate(v, true),
		};
		prefetchOrders(
			withRanges({
				...search.ranges,
				placedAtRange: nextPlacedAtRange,
			}),
		);
	};

	return {
		inputValue,
		setInputValue,
		orderStatus: filters.orderStatuses[0] ?? "",
		setOrderStatus: (v: string) => {
			setFilters({
				...filters,
				orderStatuses: v ? [v as OrderStatus] : [],
			});
		},
		paymentStatus: filters.paymentStatuses[0] ?? "",
		setPaymentStatus: (v: string) => {
			setFilters({
				...filters,
				paymentStatuses: v ? [v as PaymentStatus] : [],
			});
		},
		shippingStatus: filters.shippingStatuses[0] ?? "",
		setShippingStatus: (v: string) => {
			setFilters({
				...filters,
				shippingStatuses: v ? [v as ShippingStatus] : [],
			});
		},
		carrier: filters.carriers[0] ?? "",
		setCarrier: (v: string) => {
			setFilters({
				...filters,
				carriers: v ? [v as ShippingCarrier] : [],
			});
		},
		dateFrom,
		setDateFrom: (v: string) => {
			const nextPlacedAtRange = {
				from: toDate(v),
				to: toDate(dateTo, true),
			};
			setRanges({
				...search.ranges,
				placedAtRange:
					nextPlacedAtRange.from || nextPlacedAtRange.to
						? nextPlacedAtRange
						: undefined,
			});
		},
		dateTo,
		setDateTo: (v: string) => {
			const nextPlacedAtRange = {
				from: toDate(dateFrom),
				to: toDate(v, true),
			};
			setRanges({
				...search.ranges,
				placedAtRange:
					nextPlacedAtRange.from || nextPlacedAtRange.to
						? nextPlacedAtRange
						: undefined,
			});
		},
		setPage,
		prefetchPage,
		prefetchOrderStatus,
		prefetchPaymentStatus,
		prefetchShippingStatus,
		prefetchCarrier,
		prefetchDateFrom,
		prefetchDateTo,
		items,
		pagination,
		isLoading,
		isError,
	};
}
