import { useState } from "react";
import { useOrdersPage } from "#/hooks/use-orders-page";
import type { AdminOrderListItemType } from "#/server/orders/admin/admin.types";
import { ArchiveOrderDialog } from "./sections/archive-order-dialog";
import { OrdersDetailSheet } from "./sections/orders-detail-sheet";
import { OrdersPagination } from "./sections/orders-pagination";
import { OrdersTable } from "./sections/orders-table";
import { OrdersToolbar } from "./sections/orders-toolbar";
import { UpdateOrderStatusModal } from "./sections/update-order-status-modal";

export function OrdersPage() {
	const hook = useOrdersPage();

	const [selectedItem, setSelectedItem] =
		useState<AdminOrderListItemType | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [archiveTarget, setArchiveTarget] =
		useState<AdminOrderListItemType | null>(null);
	const [updateStatusTarget, setUpdateStatusTarget] =
		useState<AdminOrderListItemType | null>(null);

	const handleRowClick = (item: AdminOrderListItemType) => {
		setSelectedItem(item);
		setIsDetailOpen(true);
	};

	return (
		<div className="space-y-4 py-6">
			<div>
				<h1 className="text-xl font-bold text-foreground">Orders</h1>
				<p className="text-sm text-muted mt-0.5">
					Manage and track customer orders
				</p>
			</div>

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
				dateTo={hook.dateTo}
				setDateTo={hook.setDateTo}
			/>

			<div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
				<OrdersTable items={hook.items} onRowClick={handleRowClick} />
				<OrdersPagination
					currentPage={hook.pagination.page}
					totalPages={hook.pagination.totalPages}
					totalItems={hook.pagination.total}
					limit={hook.pagination.limit}
					onPageChange={hook.setPage}
				/>
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
