import { useState } from "react";
import { DataError } from "#/components/ui/states/data-error";
import { DataLoading } from "#/components/ui/states/data-loading";
import {
	usePersistedViewMode,
	ViewModeToggle,
} from "#/components/ui/view-mode-toggle";
import type { OrderListItem } from "./orders.types";
import { ArchiveOrderDialog } from "./sections/archive-order-dialog";
import { OrdersDetailSheet } from "./sections/orders-detail-sheet";
import { OrdersPagination } from "./sections/orders-pagination";
import { OrdersCards, OrdersList, OrdersTable } from "./sections/orders-table";
import { OrdersToolbar } from "./sections/orders-toolbar";
import { UpdateOrderStatusModal } from "./sections/update-order-status-modal";
import { useOrdersPage } from "./use-orders-page";

export function OrdersPage() {
	const hook = useOrdersPage();
	const [viewMode, setViewMode] = usePersistedViewMode(
		"admin:orders:view-mode",
	);

	const [selectedItem, setSelectedItem] = useState<OrderListItem | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [archiveTarget, setArchiveTarget] = useState<OrderListItem | null>(
		null,
	);
	const [updateStatusTarget, setUpdateStatusTarget] =
		useState<OrderListItem | null>(null);

	const handleRowClick = (item: OrderListItem) => {
		setSelectedItem(item);
		setIsDetailOpen(true);
	};

	return (
		<div className="space-y-4 py-4 sm:py-6">
			<div>
				<h1 className="text-xl font-bold text-foreground">Orders</h1>
				<p className="text-sm text-muted mt-0.5">
					Manage and track customer orders
				</p>
			</div>

			<div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
				<div className="min-w-0 flex-1">
					<OrdersToolbar
						inputValue={hook.inputValue}
						setInputValue={hook.setInputValue}
						orderStatus={hook.orderStatus}
						setOrderStatus={hook.setOrderStatus}
						paymentStatus={hook.paymentStatus}
						setPaymentStatus={hook.setPaymentStatus}
						shippingStatus={hook.shippingStatus}
						setShippingStatus={hook.setShippingStatus}
						carrier={hook.carrier}
						setCarrier={hook.setCarrier}
						dateFrom={hook.dateFrom}
						setDateFrom={hook.setDateFrom}
						prefetchDateFrom={hook.prefetchDateFrom}
						dateTo={hook.dateTo}
						setDateTo={hook.setDateTo}
						prefetchDateTo={hook.prefetchDateTo}
						prefetchOrderStatus={hook.prefetchOrderStatus}
						prefetchPaymentStatus={hook.prefetchPaymentStatus}
						prefetchShippingStatus={hook.prefetchShippingStatus}
						prefetchCarrier={hook.prefetchCarrier}
					/>
				</div>
				<ViewModeToggle value={viewMode} onChange={setViewMode} />
			</div>

			<div className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
				{hook.isLoading ? (
					<DataLoading label="Loading orders..." />
				) : hook.isError ? (
					<DataError title="Failed to load orders" />
				) : (
					<>
						{viewMode === "table" ? (
							<OrdersTable items={hook.items} onRowClick={handleRowClick} />
						) : null}
						{viewMode === "list" ? (
							<OrdersList items={hook.items} onRowClick={handleRowClick} />
						) : null}
						{viewMode === "cards" ? (
							<OrdersCards items={hook.items} onRowClick={handleRowClick} />
						) : null}
						<OrdersPagination
							currentPage={hook.pagination.page}
							totalPages={hook.pagination.totalPages}
							totalItems={hook.pagination.total}
							limit={hook.pagination.limit}
							onPageChange={hook.setPage}
							onPrefetchPage={hook.prefetchPage}
						/>
					</>
				)}
			</div>

			<OrdersDetailSheet
				item={selectedItem}
				isOpen={isDetailOpen}
				onClose={() => setIsDetailOpen(false)}
				onArchive={(item) => {
					setArchiveTarget(item);
					setIsDetailOpen(false);
				}}
				onUpdateStatus={(item) => {
					setUpdateStatusTarget(item);
					setIsDetailOpen(false);
				}}
			/>

			<ArchiveOrderDialog
				item={archiveTarget}
				onClose={() => setArchiveTarget(null)}
			/>

			<UpdateOrderStatusModal
				item={updateStatusTarget}
				onClose={() => setUpdateStatusTarget(null)}
			/>
		</div>
	);
}
