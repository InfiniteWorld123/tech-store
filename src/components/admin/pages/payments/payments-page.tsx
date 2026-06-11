"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DataError } from "#/components/ui/states/data-error";
import { DataLoading } from "#/components/ui/states/data-loading";
import {
	usePersistedViewMode,
	ViewModeToggle,
} from "#/components/ui/view-mode-toggle";
import { listPaymentsQueryOptions } from "#/queries/payments.queries";
import { Route } from "#/routes/admin/payments";
import { PaymentsPagination } from "./sections/payments-pagination";
import {
	PaymentsCards,
	PaymentsList,
	PaymentsTable,
} from "./sections/payments-table";
import { PaymentsToolbar } from "./sections/payments-toolbar";

export function PaymentsPage() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const queryClient = useQueryClient();
	const [viewMode, setViewMode] = usePersistedViewMode(
		"admin:payments:view-mode",
	);

	const [inputValue, setInputValue] = useState(search.search ?? "");

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate({
				search: (prev) => ({
					...prev,
					search: inputValue.trim() || undefined,
					page: 1,
				}),
			});
		}, 400);
		return () => clearTimeout(timer);
	}, [inputValue, navigate]);

	const { data, isLoading, isError } = useQuery(
		listPaymentsQueryOptions(search),
	);

	const items = data?.data.items ?? [];
	const pagination = data?.data.pagination;

	function setStatus(value: string) {
		navigate({
			search: (prev) => ({
				...prev,
				status: (value as typeof search.status) || undefined,
				page: 1,
			}),
		});
	}

	function setMethod(value: string) {
		navigate({
			search: (prev) => ({
				...prev,
				method: (value as typeof search.method) || undefined,
				page: 1,
			}),
		});
	}

	function setPage(value: number) {
		navigate({
			search: (prev) => ({ ...prev, page: value }),
		});
	}

	function prefetchPage(targetPage: number) {
		queryClient.prefetchQuery(
			listPaymentsQueryOptions({ ...search, page: targetPage }),
		);
	}

	return (
		<div className="space-y-4 py-6">
			<div>
				<h1 className="text-xl font-bold text-foreground">Payments</h1>
				<p className="text-sm text-muted mt-0.5">
					View and manage all payment transactions
				</p>
			</div>

			<div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
				<div className="min-w-0 flex-1">
					<PaymentsToolbar
						search={inputValue}
						onSearchChange={setInputValue}
						status={search.status}
						onStatusChange={setStatus}
						method={search.method}
						onMethodChange={setMethod}
					/>
				</div>
				<ViewModeToggle value={viewMode} onChange={setViewMode} />
			</div>

			<div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
				{isLoading ? (
					<DataLoading label="Loading payments..." />
				) : isError ? (
					<DataError title="Failed to load payments" />
				) : (
					<>
						{viewMode === "table" ? <PaymentsTable items={items} /> : null}
						{viewMode === "list" ? <PaymentsList items={items} /> : null}
						{viewMode === "cards" ? <PaymentsCards items={items} /> : null}

						{pagination && (
							<PaymentsPagination
								currentPage={search.page}
								totalPages={pagination.totalPages}
								totalItems={pagination.total}
								limit={search.limit}
								onPageChange={setPage}
								onPrefetchPage={prefetchPage}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
}
