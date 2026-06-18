import { Chip } from "@heroui/react";
import { Archive, Package, RefreshCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { OrderListItem } from "../orders.types";

type OrdersDetailSheetProps = {
	item: OrderListItem | null;
	isOpen: boolean;
	onClose: () => void;
	onArchive: (item: OrderListItem) => void;
	onUpdateStatus: (item: OrderListItem) => void;
};

type ChipColor = "default" | "accent" | "success" | "warning" | "danger";

const orderStatusColors: Record<string, ChipColor> = {
	pending: "default",
	processing: "accent",
	completed: "success",
	cancelled: "danger",
};

const orderStatusLabels: Record<string, string> = {
	pending: "Pending",
	processing: "Processing",
	completed: "Completed",
	cancelled: "Cancelled",
};

const paymentMethodLabels: Record<string, string> = {
	card: "Card",
	paypal: "PayPal",
	bank_transfer: "Bank Transfer",
	cash_on_delivery: "Cash on Delivery",
};

const paymentStatusLabels: Record<string, string> = {
	pending: "Pending",
	paid: "Paid",
	failed: "Failed",
	refunded: "Refunded",
};

const shippingCarrierLabels: Record<string, string> = {
	dhl: "DHL",
	hermes: "Hermes",
	ups: "UPS",
	fedex: "FedEx",
};

const shippingMethodLabels: Record<string, string> = {
	standard: "Standard",
	express: "Express",
	same_day: "Same Day",
};

const shippingStatusLabels: Record<string, string> = {
	pending: "Pending",
	packed: "Packed",
	shipped: "Shipped",
	in_transit: "In Transit",
	delivered: "Delivered",
};

function formatCurrency(amount: number): string {
	return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string | null | undefined): string {
	if (!dateStr) return "—";
	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

type InfoRowProps = {
	label: string;
	value: string | null | undefined;
	mono?: boolean;
};

function InfoRow({ label, value, mono }: InfoRowProps) {
	return (
		<div className="grid min-w-0 gap-1 min-[360px]:grid-cols-[7rem_minmax(0,1fr)] min-[360px]:gap-3">
			<span className="text-xs text-muted min-[360px]:pt-0.5">{label}</span>
			<span
				className={`min-w-0 break-all text-left text-sm text-foreground min-[360px]:text-right ${mono ? "font-mono text-xs" : ""}`}
			>
				{value ?? "—"}
			</span>
		</div>
	);
}

type ActionButtonProps = {
	icon: React.ReactNode;
	label: string;
	description: string;
	disabled?: boolean;
	onPress: () => void;
};

function ActionButton({
	icon,
	label,
	description,
	disabled,
	onPress,
}: ActionButtonProps) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onPress}
			className="flex w-full min-w-0 items-start gap-3 rounded-xl border border-border px-3 py-2.5 text-left transition-colors hover:bg-default/50 disabled:cursor-not-allowed disabled:opacity-40"
		>
			<span className="size-8 rounded-lg bg-default/50 flex items-center justify-center text-foreground flex-shrink-0">
				{icon}
			</span>
			<div className="min-w-0">
				<p className="break-words text-sm font-medium text-foreground">
					{label}
				</p>
				<p className="break-words text-xs text-muted">{description}</p>
			</div>
		</button>
	);
}

export function OrdersDetailSheet({
	item,
	isOpen,
	onClose,
	onArchive,
	onUpdateStatus,
}: OrdersDetailSheetProps) {
	const [displayItem, setDisplayItem] = useState<OrderListItem | null>(null);

	useEffect(() => {
		if (item) setDisplayItem(item);
	}, [item]);

	const isTerminal =
		displayItem?.status === "completed" || displayItem?.status === "cancelled";

	return (
		<>
			{/* Backdrop */}
			<button
				type="button"
				aria-label="Close order details"
				onClick={onClose}
				tabIndex={isOpen ? 0 : -1}
				className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 cursor-default ${
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
			/>

			{/* Panel */}
			<div
				className={`fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col bg-surface shadow-xl transition-transform duration-300 ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				{displayItem && (
					<>
						{/* Header */}
						<div className="flex flex-shrink-0 items-start justify-between gap-2 border-b border-border px-3 py-4 sm:px-5">
							<div className="flex min-w-0 items-center gap-3">
								<div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
									<Package size={16} className="text-primary" />
								</div>
								<div className="min-w-0">
									<p className="break-all text-sm font-semibold text-foreground">
										{displayItem.orderNumber}
									</p>
									<p className="text-xs text-muted">Order Details</p>
								</div>
							</div>
							<div className="flex shrink-0 items-center gap-1 sm:gap-2">
								<Chip
									variant="soft"
									color={orderStatusColors[displayItem.status]}
									size="sm"
								>
									{orderStatusLabels[displayItem.status]}
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
						<div className="flex-1 space-y-6 overflow-y-auto p-3 sm:p-5">
							{/* Order Info */}
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
									Order Info
								</p>
								<div className="space-y-3">
									<InfoRow
										label="Order #"
										value={displayItem.orderNumber}
										mono
									/>
									<InfoRow
										label="Subtotal"
										value={formatCurrency(displayItem.subtotal)}
									/>
									<InfoRow
										label="Shipping Fee"
										value={formatCurrency(displayItem.shippingFee)}
									/>
									<InfoRow
										label="Tax"
										value={formatCurrency(displayItem.taxAmount)}
									/>
									<InfoRow
										label="Total"
										value={formatCurrency(displayItem.totalAmount)}
									/>
									<InfoRow
										label="Placed At"
										value={formatDate(displayItem.placedAt)}
									/>
									<InfoRow
										label="Items"
										value={String(displayItem.itemCount)}
									/>
									<InfoRow label="Notes" value={displayItem.notes} />
								</div>
							</div>

							{/* Customer */}
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
									Customer
								</p>
								<div className="space-y-3">
									<InfoRow label="Name" value={displayItem.customer.name} />
									<InfoRow label="Email" value={displayItem.customer.email} />
								</div>
							</div>

							{/* Payment */}
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
									Payment
								</p>
								<div className="space-y-3">
									<InfoRow
										label="Method"
										value={paymentMethodLabels[displayItem.payment.method]}
									/>
									<InfoRow
										label="Status"
										value={paymentStatusLabels[displayItem.payment.status]}
									/>
									<InfoRow
										label="Amount"
										value={formatCurrency(displayItem.payment.amount)}
									/>
									<InfoRow
										label="Paid At"
										value={formatDate(displayItem.payment.paidAt)}
									/>
								</div>
							</div>

							{/* Shipping */}
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
									Shipping
								</p>
								<div className="space-y-3">
									<InfoRow
										label="Carrier"
										value={shippingCarrierLabels[displayItem.shipping.carrier]}
									/>
									<InfoRow
										label="Method"
										value={shippingMethodLabels[displayItem.shipping.method]}
									/>
									<InfoRow
										label="Status"
										value={shippingStatusLabels[displayItem.shipping.status]}
									/>
									<InfoRow
										label="Tracking #"
										value={displayItem.shipping.trackingNumber}
										mono
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
										icon={<RefreshCcw size={14} />}
										label="Update Status"
										description="Change the current order status"
										disabled={isTerminal}
										onPress={() => onUpdateStatus(displayItem)}
									/>
									<ActionButton
										icon={<Archive size={14} />}
										label="Archive Order"
										description="Remove this order from the active list"
										onPress={() => onArchive(displayItem)}
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
