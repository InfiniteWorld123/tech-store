import { useState } from "react";
import { DataError } from "#/components/ui/states/data-error";
import { DataLoading } from "#/components/ui/states/data-loading";
import {
	usePersistedViewMode,
	ViewModeToggle,
} from "#/components/ui/view-mode-toggle";
import { AddTrackingModal } from "./sections/add-tracking-modal";
import { CreateShipmentModal } from "./sections/create-shipment-modal";
import { MarkShippedModal } from "./sections/mark-shipped-modal";
import { ShippingDetailSheet } from "./sections/shipping-detail-sheet";
import { ShippingPagination } from "./sections/shipping-pagination";
import {
	ShippingCards,
	ShippingList,
	ShippingTable,
} from "./sections/shipping-table";
import { ShippingToolbar } from "./sections/shipping-toolbar";
import { UpdateStatusModal } from "./sections/update-status-modal";
import type { ShippingListItem } from "./shipping.types";
import { useShippingPage } from "./use-shipping-page";

export function ShippingPage() {
	const [viewMode, setViewMode] = usePersistedViewMode(
		"admin:shipping:view-mode",
	);
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
	const [selectedItem, setSelectedItem] = useState<ShippingListItem | null>(
		null,
	);

	// UI state — modals (non-null = open, mirrors categories pattern)
	const [markShippedTarget, setMarkShippedTarget] =
		useState<ShippingListItem | null>(null);
	const [addTrackingTarget, setAddTrackingTarget] =
		useState<ShippingListItem | null>(null);
	const [updateStatusTarget, setUpdateStatusTarget] =
		useState<ShippingListItem | null>(null);
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

			<div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
				<div className="min-w-0 flex-1">
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
				</div>
				<ViewModeToggle value={viewMode} onChange={setViewMode} />
			</div>

			<div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
				{isLoading ? (
					<DataLoading label="Loading shipments..." />
				) : isError ? (
					<DataError title="Failed to load shipments" />
				) : (
					<>
						{viewMode === "table" ? (
							<ShippingTable
								items={items}
								onRowClick={setSelectedItem}
								onMarkShipped={handleMarkShipped}
								onMarkDelivered={() => {}}
								onStatusChange={() => {}}
								onAddTracking={handleAddTracking}
							/>
						) : null}
						{viewMode === "list" ? (
							<ShippingList
								items={items}
								onRowClick={setSelectedItem}
								onMarkShipped={handleMarkShipped}
								onMarkDelivered={() => {}}
								onStatusChange={() => {}}
								onAddTracking={handleAddTracking}
							/>
						) : null}
						{viewMode === "cards" ? (
							<ShippingCards
								items={items}
								onRowClick={setSelectedItem}
								onMarkShipped={handleMarkShipped}
								onMarkDelivered={() => {}}
								onStatusChange={() => {}}
								onAddTracking={handleAddTracking}
							/>
						) : null}
					</>
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
