"use client";

import { Button, Chip, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Package, Search } from "lucide-react";
import { useCallback, useEffect } from "react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { WindowedPagination } from "#/components/ui/pagination/windowed-pagination";
import { useDebouncedSearchParam } from "#/hooks/use-debounced-search-param";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import {
	getCustomerOrderDetailQueryOptions,
	getOrderTrackingQueryOptions,
	listCustomerOrdersQueryOptions,
} from "#/queries/orders.queries";
import { listProductsQueryOptions } from "#/queries/products.queries";
import { Route } from "#/routes/account/orders/index";
import type { GetProductsInputType } from "#/server/catalog/products/products.types";
import type { OrderStatusType } from "#/server/orders/admin/admin.types";
import type { CustomerOrderListItemType } from "#/server/orders/customer/customer.types";

const LIMIT = 10;
const catalogProductsInput = {
	pagination: { page: 1, limit: 12 },
	sorting: { sortBy: "createdAt", sortOrder: "desc" },
	flags: { isActive: true },
} satisfies GetProductsInputType;

const STATUS_TABS: Array<{
	value: "all" | "active" | "completed" | "cancelled";
	label: string;
}> = [
	{ value: "all", label: "All" },
	{ value: "active", label: "Active" },
	{ value: "completed", label: "Completed" },
	{ value: "cancelled", label: "Cancelled" },
];

function orderStatusColor(
	status: OrderStatusType,
): "default" | "accent" | "success" | "danger" | "warning" {
	switch (status) {
		case "pending":
		case "processing":
			return "accent";
		case "completed":
			return "success";
		case "cancelled":
			return "danger";
		default:
			return "default";
	}
}

function OrderRow({ order }: { order: CustomerOrderListItemType }) {
	const { prefetch } = useQueryIntentPrefetch();
	const prefetchOrder = () => {
		prefetch(getCustomerOrderDetailQueryOptions({ orderId: order.id }));
		if (order.canTrack) {
			prefetch(getOrderTrackingQueryOptions({ orderId: order.id }));
		}
	};

	return (
		<Link
			to="/account/orders/$orderId"
			params={{ orderId: order.id }}
			className="group flex w-full flex-col gap-3 rounded-2xl border border-border p-4 text-left transition-all hover:border-accent/50 hover:bg-accent/5 sm:flex-row sm:items-center sm:gap-4"
			onFocus={prefetchOrder}
			onMouseEnter={prefetchOrder}
		>
			<div className="flex min-w-0 items-start gap-3 sm:flex-1 sm:items-center">
				{order.firstItemImage ? (
					<img
						src={order.firstItemImage}
						alt={order.firstItemName ?? ""}
						className="h-12 w-12 flex-shrink-0 rounded-xl object-cover"
					/>
				) : (
					<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-surface-secondary">
						<Package size={16} className="text-muted" />
					</div>
				)}

				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<p className="text-sm font-semibold text-foreground">
							#{order.orderNumber}
						</p>
						<Chip
							size="sm"
							color={orderStatusColor(order.status)}
							variant="soft"
						>
							{order.status}
						</Chip>
						{order.payment.status === "paid" && (
							<Chip size="sm" color="success" variant="soft">
								Paid
							</Chip>
						)}
					</div>
					<p className="mt-0.5 truncate text-xs text-muted">
						{order.firstItemName ?? "–"}
						{order.itemCount > 1 && ` +${order.itemCount - 1} more`}
					</p>
				</div>
			</div>

			<div className="flex items-end justify-between gap-3 border-t border-border pt-3 sm:block sm:flex-shrink-0 sm:border-0 sm:pt-0 sm:text-right">
				<div>
					<p className="text-sm font-bold text-foreground">
						€{order.totalAmount.toLocaleString()}
					</p>
					<p className="text-xs text-muted">
						{new Date(order.placedAt).toLocaleDateString("en-DE", {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</p>
				</div>
				<p className="inline-flex items-center justify-end gap-1 text-xs font-medium text-accent sm:mt-1 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus:opacity-100">
					View details
					<ArrowRight size={12} />
				</p>
			</div>
		</Link>
	);
}

export function OrdersPage() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { prefetch } = useQueryIntentPrefetch();

	const { status = "all", page = 1 } = search;

	const buildOrdersInput = useCallback(
		(nextSearch: typeof search) => ({
			status: nextSearch.status,
			page: nextSearch.page,
			limit: LIMIT,
			searchOrderNumber: nextSearch.searchOrderNumber,
		}),
		[],
	);

	const { data, isLoading } = useQuery(
		listCustomerOrdersQueryOptions(buildOrdersInput(search)),
	);

	const orders = data?.data?.items ?? [];
	const pagination = data?.data?.pagination;

	useEffect(() => {
		if (
			!pagination ||
			pagination.total === 0 ||
			page <= pagination.totalPages
		) {
			return;
		}

		navigate({
			replace: true,
			search: (prev) => ({ ...prev, page: pagination.totalPages }),
		});
	}, [navigate, page, pagination]);

	const prefetchOrders = useCallback(
		(nextSearch: typeof search) =>
			prefetch(listCustomerOrdersQueryOptions(buildOrdersInput(nextSearch))),
		[buildOrdersInput, prefetch],
	);

	const setSearch = useCallback(
		(partial: Partial<typeof search>) =>
			navigate({ search: (prev) => ({ ...prev, ...partial }) }),
		[navigate],
	);

	const commitSearch = useCallback(
		(value: string | undefined) => {
			navigate({
				search: (prev) => ({
					...prev,
					searchOrderNumber: value,
					page: 1,
				}),
			});
		},
		[navigate],
	);
	const { inputValue, setInputValue } = useDebouncedSearchParam({
		committedValue: search.searchOrderNumber,
		onCommit: commitSearch,
	});

	const setStatus = (
		nextStatus: "all" | "active" | "completed" | "cancelled",
	) => {
		prefetchOrders({ ...search, status: nextStatus, page: 1 });
		setSearch({ status: nextStatus, page: 1 });
	};

	const setPage = (nextPage: number) => {
		prefetchOrders({ ...search, page: nextPage });
		setSearch({ page: nextPage });
	};

	const prefetchPage = (nextPage: number) => {
		if (nextPage === page) return;
		prefetchOrders({ ...search, page: nextPage });
	};
	const prefetchProducts = () =>
		prefetch(listProductsQueryOptions({ data: catalogProductsInput }));

	return (
		<div className="min-w-0">
			<h1 className="mb-5 text-xl font-bold text-foreground sm:mb-6 sm:text-2xl">
				My Orders
			</h1>

			{/* Search */}
			<div className="relative mb-5">
				<Search
					size={14}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
				/>
				<input
					type="text"
					placeholder="Search by order number..."
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border bg-surface text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
				/>
			</div>

			{/* Status tabs */}
			<div className="-mx-3 mb-6 flex gap-1 overflow-x-auto border-b border-border px-3 sm:mx-0 sm:px-0">
				{STATUS_TABS.map((tab) => (
					<button
						key={tab.value}
						type="button"
						onClick={() => setStatus(tab.value)}
						onFocus={() =>
							prefetchOrders({ ...search, status: tab.value, page: 1 })
						}
						onMouseEnter={() =>
							prefetchOrders({ ...search, status: tab.value, page: 1 })
						}
						className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
							status === tab.value
								? "border-accent text-accent"
								: "border-transparent text-muted hover:text-foreground"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Orders */}
			{isLoading ? (
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-20 rounded-2xl" />
					))}
				</div>
			) : orders.length === 0 ? (
				<div className="space-y-3 rounded-2xl border border-dashed border-border p-6 text-center sm:p-12">
					<Package size={28} className="text-muted mx-auto" />
					<p className="text-foreground font-semibold">No orders found</p>
					<p className="text-muted text-sm">
						{status !== "all"
							? "Try switching to 'All' to see all your orders."
							: "You haven't placed any orders yet."}
					</p>
					<LinkAnchor
						to="/products"
						onFocus={prefetchProducts}
						onMouseEnter={prefetchProducts}
					>
						<Button variant="primary" size="sm">
							Browse products
						</Button>
					</LinkAnchor>
				</div>
			) : (
				<div className="space-y-3">
					{orders.map((order) => (
						<OrderRow key={order.id} order={order} />
					))}
				</div>
			)}

			{pagination && pagination.totalPages > 1 && (
				<WindowedPagination
					className="mt-8 pt-4 border-t border-border"
					currentPage={page}
					totalPages={pagination.totalPages}
					totalItems={pagination.total}
					limit={LIMIT}
					itemLabel="order"
					onPageChange={setPage}
					onPrefetchPage={prefetchPage}
				/>
			)}
		</div>
	);
}
