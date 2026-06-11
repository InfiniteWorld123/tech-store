import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useShippingPage } from "#/hooks/use-shipping-page";
import type { ShippingListItemType } from "#/server/shipping/shipping.types";
import { AddTrackingModal } from "./sections/add-tracking-modal";
import { CreateShipmentModal } from "./sections/create-shipment-modal";
import { MarkShippedModal } from "./sections/mark-shipped-modal";
import { ShippingDetailSheet } from "./sections/shipping-detail-sheet";
import { ShippingPagination } from "./sections/shipping-pagination";
import { ShippingTable } from "./sections/shipping-table";
import { ShippingToolbar } from "./sections/shipping-toolbar";
import { UpdateStatusModal } from "./sections/update-status-modal";

export function ShippingPage() {
	const {
		inputValue,
		setInputValue,
		status,
		setStatus,
		carrier,
		setCarrier,
		method,
		setMethod,
		dateRange,
		setDateRange,
		page,
		limit,
		setPage,
		items,
		pagination,
		isLoading,
		isError,
	} = useShippingPage();

	// UI state — detail sheet
	const [selectedItem, setSelectedItem] = useState<ShippingListItemType | null>(
		null,
	);

	// UI state — modals (non-null = open, mirrors categories pattern)
	const [markShippedTarget, setMarkShippedTarget] =
		useState<ShippingListItemType | null>(null);
	const [addTrackingTarget, setAddTrackingTarget] =
		useState<ShippingListItemType | null>(null);
	const [updateStatusTarget, setUpdateStatusTarget] =
		useState<ShippingListItemType | null>(null);
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	function handleMarkShipped(orderId: string) {
		const item = items.find((i) => i.orderId === orderId) ?? selectedItem;
		if (item) setMarkShippedTarget(item);
	}

	function handleAddTracking(orderId: string) {
		const item = items.find((i) => i.orderId === orderId) ?? selectedItem;
		if (item) setAddTrackingTarget(item);
	}

	function handleUpdateStatus(orderId: string) {
		const item = items.find((i) => i.orderId === orderId) ?? selectedItem;
		if (item) setUpdateStatusTarget(item);
	}

	return (
		<div className="space-y-4 py-6">
			{/* Page title */}
			<div>
				<h1 className="text-xl font-bold text-foreground">Shipping</h1>
				<p className="text-sm text-muted mt-0.5">
					Manage and track all shipments
				</p>
			</div>

			{/* Toolbar */}
			<ShippingToolbar
				search={inputValue}
				onSearchChange={setInputValue}
				status={status}
				onStatusChange={setStatus}
				carrier={carrier}
				onCarrierChange={setCarrier}
				method={method}
				onMethodChange={setMethod}
				dateRange={dateRange ?? {}}
				onDateRangeChange={setDateRange}
				onCreateClick={() => setIsCreateOpen(true)}
			/>

			{/* Table card */}
			<div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
				{isLoading ? (
					<div className="py-16 flex flex-col items-center gap-3 text-center">
						<Loader2 size={28} className="text-muted animate-spin" />
						<p className="text-sm text-muted">Loading shipments…</p>
					</div>
				) : isError ? (
					<div className="py-16 flex flex-col items-center gap-3 text-center">
						<AlertTriangle size={28} className="text-danger" />
						<div>
							<p className="text-sm font-medium text-foreground">
								Failed to load shipments
							</p>
							<p className="text-xs text-muted mt-1">Please try again.</p>
						</div>
					</div>
				) : (
					<ShippingTable
						items={items}
						onRowClick={setSelectedItem}
						onMarkShipped={handleMarkShipped}
						onMarkDelivered={() => {}}
						onStatusChange={() => {}}
						onAddTracking={handleAddTracking}
					/>
				)}

				{pagination && (
					<ShippingPagination
						currentPage={page}
						totalPages={pagination.totalPages}
						totalItems={pagination.total}
						limit={limit}
						onPageChange={setPage}
					/>
				)}
			</div>

			{/* Detail sheet */}
			<ShippingDetailSheet
				item={selectedItem}
				isOpen={selectedItem !== null}
				onClose={() => setSelectedItem(null)}
				onMarkShipped={handleMarkShipped}
				onMarkDelivered={() => {}}
				onStatusChange={handleUpdateStatus}
				onAddTracking={handleAddTracking}
			/>

			{/* Modals */}
			<MarkShippedModal
				item={markShippedTarget}
				onClose={() => setMarkShippedTarget(null)}
			/>
			<AddTrackingModal
				item={addTrackingTarget}
				onClose={() => setAddTrackingTarget(null)}
			/>
			<UpdateStatusModal
				item={updateStatusTarget}
				onClose={() => setUpdateStatusTarget(null)}
			/>
			<CreateShipmentModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
			/>
		</div>
	);
}
