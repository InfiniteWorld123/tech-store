"use client";

import { Chip } from "@heroui/react";
import { Copy, PackageCheck, RefreshCw, Tag, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

const allStatuses: ShippingStatusType[] = [
	"pending",
	"packed",
	"shipped",
	"in_transit",
	"delivered",
];

function formatDate(iso: string | null) {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

const thClass = "text-left py-3 px-2 text-xs font-semibold text-muted";
const tdClass = "py-3 px-2";
const iconBtnClass =
	"size-7 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-default/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

type StatusPopover = {
	orderId: string;
	top: number;
	right: number;
} | null;

type ShippingTableProps = {
	items: ShippingListItemType[];
	onRowClick: (item: ShippingListItemType) => void;
	onMarkShipped: (orderId: string) => void;
	onMarkDelivered: (orderId: string) => void;
	onStatusChange: (orderId: string, status: ShippingStatusType) => void;
	onAddTracking: (orderId: string) => void;
};

export function ShippingTable({
	items,
	onRowClick,
	onMarkShipped,
	onMarkDelivered,
	onStatusChange,
	onAddTracking,
}: ShippingTableProps) {
	const [statusPopover, setStatusPopover] = useState<StatusPopover>(null);
	const popoverRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!statusPopover) return;
		function handleDown(e: MouseEvent) {
			if (
				popoverRef.current &&
				!popoverRef.current.contains(e.target as Node)
			) {
				setStatusPopover(null);
			}
		}
		document.addEventListener("mousedown", handleDown);
		return () => document.removeEventListener("mousedown", handleDown);
	}, [statusPopover]);

	function openStatusPopover(
		e: React.MouseEvent<HTMLButtonElement>,
		item: ShippingListItemType,
	) {
		e.stopPropagation();
		const rect = e.currentTarget.getBoundingClientRect();
		setStatusPopover({
			orderId: item.orderId,
			top: rect.bottom + 4,
			right: window.innerWidth - rect.right,
		});
	}

	if (items.length === 0) {
		return (
			<div className="py-16 flex flex-col items-center gap-3 text-center">
				<Truck size={28} className="text-muted" />
				<div>
					<p className="text-sm font-medium text-foreground">
						No shipments found
					</p>
					<p className="text-xs text-muted mt-1">
						Try a different filter or create a new shipment.
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-border">
							<th className={thClass}>Order #</th>
							<th className={thClass}>Carrier</th>
							<th className={thClass}>Method</th>
							<th className={thClass}>Tracking #</th>
							<th className={thClass}>Status</th>
							<th className={thClass}>Shipped At</th>
							<th className={thClass}>Actions</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item) => (
							<tr
								key={item.id}
								onClick={() => onRowClick(item)}
								className="border-b border-border last:border-0 hover:bg-default/50 transition-colors cursor-pointer"
							>
								<td className={`${tdClass} font-medium text-foreground`}>
									{item.orderNumber}
								</td>
								<td className={`${tdClass} text-muted`}>
									{carrierLabels[item.carrier]}
								</td>
								<td className={`${tdClass} text-muted`}>
									{methodLabels[item.method]}
								</td>
								<td className={tdClass}>
									{item.trackingNumber ? (
										<span className="flex items-center gap-1.5">
											<span className="font-mono text-xs text-foreground truncate max-w-36">
												{item.trackingNumber}
											</span>
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													navigator.clipboard.writeText(
														item.trackingNumber as string,
													);
												}}
												title="Copy tracking number"
												className="text-muted hover:text-foreground transition-colors flex-shrink-0"
											>
												<Copy size={11} />
											</button>
										</span>
									) : (
										<span className="text-muted">—</span>
									)}
								</td>
								<td className={tdClass}>
									<Chip
										variant="soft"
										color={statusColors[item.status]}
										size="sm"
									>
										{statusLabels[item.status]}
									</Chip>
								</td>
								<td className={`${tdClass} text-muted whitespace-nowrap`}>
									{formatDate(item.shippedAt)}
								</td>
								<td
									className={tdClass}
									onClick={(e) => e.stopPropagation()}
									onKeyDown={(e) => e.stopPropagation()}
								>
									<div className="flex items-center gap-0.5">
										<button
											type="button"
											title="Mark as shipped"
											disabled={
												item.status === "shipped" ||
												item.status === "in_transit" ||
												item.status === "delivered"
											}
											onClick={(e) => {
												e.stopPropagation();
												onMarkShipped(item.orderId);
											}}
											className={iconBtnClass}
										>
											<Truck size={13} />
										</button>
										<button
											type="button"
											title="Mark as delivered"
											disabled={item.status === "delivered"}
											onClick={(e) => {
												e.stopPropagation();
												onMarkDelivered(item.orderId);
											}}
											className={iconBtnClass}
										>
											<PackageCheck size={13} />
										</button>
										<button
											type="button"
											title="Update status"
											disabled={item.status === "delivered"}
											onClick={(e) => openStatusPopover(e, item)}
											className={iconBtnClass}
										>
											<RefreshCw size={13} />
										</button>
										<button
											type="button"
											title="Add tracking number"
											onClick={(e) => {
												e.stopPropagation();
												onAddTracking(item.orderId);
											}}
											className={iconBtnClass}
										>
											<Tag size={13} />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Status popover — fixed to escape overflow clipping */}
			{statusPopover && (
				<div
					ref={popoverRef}
					style={{
						position: "fixed",
						top: statusPopover.top,
						right: statusPopover.right,
					}}
					className="z-50 bg-surface border border-border rounded-xl shadow-lg py-1 w-44"
				>
					{allStatuses.map((s) => (
						<button
							key={s}
							type="button"
							onClick={() => {
								onStatusChange(statusPopover.orderId, s);
								setStatusPopover(null);
							}}
							className="w-full text-left px-3 py-2 text-sm hover:bg-default/50 text-foreground transition-colors"
						>
							{statusLabels[s]}
						</button>
					))}
				</div>
			)}
		</>
	);
}
