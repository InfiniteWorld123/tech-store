"use client";

import { Button, Chip } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import {
	AdminDetailSheet,
	DetailRow,
	DetailSection,
} from "#/components/admin/ui/admin-detail-sheet";
import { DataError } from "#/components/ui/states/data-error";
import { DataLoading } from "#/components/ui/states/data-loading";
import {
	usePersistedViewMode,
	ViewModeToggle,
} from "#/components/ui/view-mode-toggle";
import { useDebouncedSearchParam } from "#/hooks/use-debounced-search-param";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { useRefundPayment } from "#/mutations/payments/use-refund-payment";
import { listPaymentsQueryOptions } from "#/queries/payments.queries";
import { Route } from "#/routes/admin/payments";
import type { PaymentListItem } from "./payments.types";
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
	const { prefetch } = useQueryIntentPrefetch();
	const [viewMode, setViewMode] = usePersistedViewMode(
		"admin:payments:view-mode",
	);
	const [detailTarget, setDetailTarget] = useState<PaymentListItem | null>(
		null,
	);

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
		listPaymentsQueryOptions(search),
	);

	const items = data?.data.items ?? [];
	const pagination = data?.data.pagination;

	const prefetchPayments = useCallback(
		(data: typeof search) => prefetch(listPaymentsQueryOptions(data)),
		[prefetch],
	);

	function setStatus(value: string) {
		prefetchPayments({
			...search,
			status: (value as typeof search.status) || undefined,
			page: 1,
		});
		navigate({
			search: (prev) => ({
				...prev,
				status: (value as typeof search.status) || undefined,
				page: 1,
			}),
		});
	}

	function setMethod(value: string) {
		prefetchPayments({
			...search,
			method: (value as typeof search.method) || undefined,
			page: 1,
		});
		navigate({
			search: (prev) => ({
				...prev,
				method: (value as typeof search.method) || undefined,
				page: 1,
			}),
		});
	}

	function setPage(value: number) {
		prefetchPayments({ ...search, page: value });
		navigate({
			search: (prev) => ({ ...prev, page: value }),
		});
	}

	function prefetchPage(targetPage: number) {
		if (targetPage === search.page) return;
		prefetchPayments({ ...search, page: targetPage });
	}

	function prefetchStatus(value: string) {
		prefetchPayments({
			...search,
			status: (value as typeof search.status) || undefined,
			page: 1,
		});
	}

	function prefetchMethod(value: string) {
		prefetchPayments({
			...search,
			method: (value as typeof search.method) || undefined,
			page: 1,
		});
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
						onPrefetchStatus={prefetchStatus}
						method={search.method}
						onMethodChange={setMethod}
						onPrefetchMethod={prefetchMethod}
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
						{viewMode === "table" ? (
							<PaymentsTable items={items} onView={setDetailTarget} />
						) : null}
						{viewMode === "list" ? (
							<PaymentsList items={items} onView={setDetailTarget} />
						) : null}
						{viewMode === "cards" ? (
							<PaymentsCards items={items} onView={setDetailTarget} />
						) : null}

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
			<PaymentDetailSheet
				item={detailTarget}
				onClose={() => setDetailTarget(null)}
			/>
		</div>
	);
}

const methodLabels: Record<PaymentListItem["method"], string> = {
	card: "Card",
	paypal: "PayPal",
	bank_transfer: "Bank Transfer",
	cash_on_delivery: "Cash on Delivery",
};

const statusColors: Record<
	PaymentListItem["status"],
	"success" | "warning" | "danger" | "default"
> = {
	paid: "success",
	pending: "warning",
	failed: "danger",
	refunded: "default",
};

function formatAmount(amount: number, currency: string | null) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency ?? "USD",
	}).format(amount);
}

function formatDate(iso: string | null) {
	if (!iso) return "—";
	return new Date(iso).toLocaleString();
}

function PaymentDetailSheet({
	item,
	onClose,
}: {
	item: PaymentListItem | null;
	onClose: () => void;
}) {
	const refundPayment = useRefundPayment();

	return (
		<AdminDetailSheet
			isOpen={item !== null}
			onClose={onClose}
			title={item?.orderNumber ?? "Payment"}
			subtitle={item ? formatAmount(item.amount, item.currency) : undefined}
			badge={
				item ? (
					<Chip size="sm" variant="soft" color={statusColors[item.status]}>
						{item.status.charAt(0).toUpperCase() + item.status.slice(1)}
					</Chip>
				) : null
			}
			footer={
				item?.status === "paid" ? (
					<Button
						size="sm"
						variant="danger"
						isPending={
							refundPayment.isPending &&
							refundPayment.variables?.orderId === item.orderId
						}
						isDisabled={refundPayment.isPending}
						onPress={() => refundPayment.mutate({ orderId: item.orderId })}
					>
						Refund
					</Button>
				) : null
			}
		>
			{item ? (
				<div className="space-y-5">
					<DetailSection title="Payment">
						<DetailRow label="ID" value={item.id} mono />
						<DetailRow label="Order ID" value={item.orderId} mono />
						<DetailRow label="Order #" value={item.orderNumber} mono />
						<DetailRow label="Method" value={methodLabels[item.method]} />
						<DetailRow
							label="Amount"
							value={formatAmount(item.amount, item.currency)}
						/>
						<DetailRow label="Currency" value={item.currency ?? "USD"} />
					</DetailSection>
					<DetailSection title="Status">
						<DetailRow label="Status" value={item.status} />
						<DetailRow label="Paid at" value={formatDate(item.paidAt)} />
						<DetailRow label="Created" value={formatDate(item.createdAt)} />
					</DetailSection>
				</div>
			) : null}
		</AdminDetailSheet>
	);
}
