"use client";

import { Chip } from "@heroui/react";
import { Copy, PackageCheck, RefreshCw, Tag, Truck, X } from "lucide-react";
import { useEffect, useState } from "react";
import type {
	ShippingListItemType,
	ShippingStatusType,
} from "#/server/shipping/shipping.types";

const statusColors: Record<
	ShippingStatusType,
	"default" | "accent" | "success" | "warning" | "danger"
> = {
	pending: "default",
	packed: "accent",
	shipped: "warning",
	in_transit: "danger",
	delivered: "success",
};

const statusLabels: Record<ShippingStatusType, string> = {
	pending: "Pending",
	packed: "Packed",
	shipped: "Shipped",
	in_transit: "In Transit",
	delivered: "Delivered",
};

const carrierLabels: Record<ShippingListItemType["carrier"], string> = {
	dhl: "DHL",
	hermes: "Hermes",
	ups: "UPS",
	fedex: "FedEx",
};

const methodLabels: Record<ShippingListItemType["method"], string> = {
	standard: "Standard",
	express: "Express",
	same_day: "Same Day",
};

function formatDate(iso: string | null) {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

type ShippingDetailSheetProps = {
	item: ShippingListItemType | null;
	isOpen: boolean;
	onClose: () => void;
	onMarkShipped: (orderId: string) => void;
	onMarkDelivered: (orderId: string) => void;
	onStatusChange: (orderId: string) => void;
	onAddTracking: (orderId: string) => void;
};

export function ShippingDetailSheet({
	item,
	isOpen,
	onClose,
	onMarkShipped,
	onMarkDelivered,
	onStatusChange,
	onAddTracking,
}: ShippingDetailSheetProps) {
	const [displayItem, setDisplayItem] = useState<ShippingListItemType | null>(
		null,
	);

	useEffect(() => {
		if (item) setDisplayItem(item);
	}, [item]);

	return (
		<>
			{/* Backdrop */}
			<button
				type="button"
				aria-label="Close shipment details"
				onClick={onClose}
				tabIndex={isOpen ? 0 : -1}
				className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 cursor-default ${
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
			/>

			{/* Panel */}
			<div
				className={`fixed inset-y-0 right-0 z-40 w-full max-w-md bg-surface shadow-xl flex flex-col transition-transform duration-300 ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				{displayItem && (
					<>
						{/* Header */}
						<div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
							<div className="flex items-center gap-3">
								<div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
									<Truck size={16} className="text-primary" />
								</div>
								<div>
									<p className="text-sm font-semibold text-foreground">
										{displayItem.orderNumber}
									</p>
									<p className="text-xs text-muted">Shipment Details</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Chip
									variant="soft"
									color={statusColors[displayItem.status]}
									size="sm"
								>
									{statusLabels[displayItem.status]}
								</Chip>
								<button
									type="button"
									onClick={onClose}
									className="size-7 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-default/50 transition-colors"
								>
									<X size={15} />
								</button>
							</div>
						</div>

						{/* Body */}
						<div className="flex-1 overflow-y-auto p-5 space-y-6">
							{/* Shipping Info */}
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
									Shipping Info
								</p>
								<div className="space-y-3">
									<InfoRow label="Order ID" value={displayItem.orderId} mono />
									<InfoRow
										label="Carrier"
										value={carrierLabels[displayItem.carrier]}
									/>
									<InfoRow
										label="Method"
										value={methodLabels[displayItem.method]}
									/>
									<div className="flex justify-between items-start gap-3">
										<span className="text-xs text-muted w-24 flex-shrink-0 pt-0.5">
											Tracking #
										</span>
										{displayItem.trackingNumber ? (
											<span className="flex items-center gap-1.5 text-right">
												<span className="font-mono text-xs text-foreground break-all">
													{displayItem.trackingNumber}
												</span>
												<button
													type="button"
													onClick={() =>
														navigator.clipboard.writeText(
															displayItem.trackingNumber as string,
														)
													}
													title="Copy tracking number"
													className="text-muted hover:text-foreground transition-colors flex-shrink-0"
												>
													<Copy size={11} />
												</button>
											</span>
										) : (
											<span className="text-sm text-muted">—</span>
										)}
									</div>
								</div>
							</div>

							{/* Timestamps */}
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
									Timeline
								</p>
								<div className="space-y-3">
									<InfoRow
										label="Created"
										value={formatDate(displayItem.createdAt)}
									/>
									<InfoRow
										label="Shipped"
										value={formatDate(displayItem.shippedAt)}
									/>
									<InfoRow
										label="Delivered"
										value={formatDate(displayItem.deliveredAt)}
									/>
									<InfoRow
										label="Updated"
										value={formatDate(displayItem.updatedAt)}
									/>
								</div>
							</div>

							{/* Actions */}
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
									Actions
								</p>
								<div className="space-y-2">
									<ActionButton
										icon={<Truck size={14} />}
										label="Mark as Shipped"
										description="Set status to shipped and record timestamp"
										disabled={
											displayItem.status === "shipped" ||
											displayItem.status === "in_transit" ||
											displayItem.status === "delivered"
										}
										onPress={() => onMarkShipped(displayItem.orderId)}
									/>
									<ActionButton
										icon={<PackageCheck size={14} />}
										label="Mark as Delivered"
										description="Set status to delivered and complete the order"
										disabled={displayItem.status === "delivered"}
										onPress={() => onMarkDelivered(displayItem.orderId)}
									/>
									<ActionButton
										icon={<RefreshCw size={14} />}
										label="Update Status"
										description="Change to any status in the shipping flow"
										disabled={displayItem.status === "delivered"}
										onPress={() => onStatusChange(displayItem.orderId)}
									/>
									<ActionButton
										icon={<Tag size={14} />}
										label="Add Tracking Number"
										description="Attach or update the tracking number"
										onPress={() => onAddTracking(displayItem.orderId)}
									/>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
}

function InfoRow({
	label,
	value,
	mono,
}: {
	label: string;
	value: string;
	mono?: boolean;
}) {
	return (
		<div className="flex justify-between items-start gap-3">
			<span className="text-xs text-muted w-24 flex-shrink-0 pt-0.5">
				{label}
			</span>
			<span
				className={`text-sm text-foreground text-right break-all ${mono ? "font-mono text-xs" : ""}`}
			>
				{value}
			</span>
		</div>
	);
}

function ActionButton({
	icon,
	label,
	description,
	disabled,
	onPress,
}: {
	icon: React.ReactNode;
	label: string;
	description: string;
	disabled?: boolean;
	onPress: () => void;
}) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onPress}
			className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border text-left hover:bg-default/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
		>
			<span className="size-8 rounded-lg bg-default/50 flex items-center justify-center text-foreground flex-shrink-0">
				{icon}
			</span>
			<div className="min-w-0">
				<p className="text-sm font-medium text-foreground">{label}</p>
				<p className="text-xs text-muted truncate">{description}</p>
			</div>
		</button>
	);
}
