"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listPaymentsQueryOptions } from "#/queries/payments.queries";
import { Route } from "#/routes/admin/payments";
import { PaymentsPagination } from "./sections/payments-pagination";
import { PaymentsTable } from "./sections/payments-table";
import { PaymentsToolbar } from "./sections/payments-toolbar";

export function PaymentsPage() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const queryClient = useQueryClient();

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

			<PaymentsToolbar
				search={inputValue}
				onSearchChange={setInputValue}
				status={search.status}
				onStatusChange={setStatus}
				method={search.method}
				onMethodChange={setMethod}
			/>

			{isLoading && <p className="text-sm text-muted">Loading payments…</p>}
			{isError && (
				<p className="text-sm text-danger">
					Failed to load payments. Please try again.
				</p>
			)}

			<div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
				<PaymentsTable items={items} />

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
			</div>
		</div>
	);
}
