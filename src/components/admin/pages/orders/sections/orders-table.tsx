import { Chip } from "@heroui/react";
import { Eye, Package } from "lucide-react";
import type { OrderListItem } from "../orders.types";

type OrdersTableProps = {
	items: OrderListItem[];
	onRowClick: (item: OrderListItem) => void;
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

const paymentStatusColors: Record<string, ChipColor> = {
	pending: "default",
	paid: "success",
	failed: "danger",
	refunded: "warning",
};

const paymentStatusLabels: Record<string, string> = {
	pending: "Pending",
	paid: "Paid",
	failed: "Failed",
	refunded: "Refunded",
};

const shippingStatusColors: Record<string, ChipColor> = {
	pending: "default",
	packed: "accent",
	shipped: "warning",
	in_transit: "danger",
	delivered: "success",
};

const shippingStatusLabels: Record<string, string> = {
	pending: "Pending",
	packed: "Packed",
	shipped: "Shipped",
	in_transit: "In Transit",
	delivered: "Delivered",
};

const thClass = "text-left py-3 px-2 text-xs font-semibold text-muted";
const tdClass = "py-3 px-2";
const iconBtnClass =
	"size-7 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-default/50 transition-colors";

function formatCurrency(amount: number): string {
	return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export function OrdersTable({ items, onRowClick }: OrdersTableProps) {
	if (items.length === 0) {
		return (
			<div className="py-16 flex flex-col items-center gap-3 text-center">
				<Package size={28} className="text-muted" />
				<div>
					<p className="text-sm font-medium text-foreground">No orders found</p>
					<p className="text-xs text-muted mt-1">
						Try adjusting your filters or search term.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-border">
						<th className={thClass}>Order #</th>
						<th className={thClass}>Customer</th>
						<th className={thClass}>Total</th>
						<th className={thClass}>Status</th>
						<th className={thClass}>Payment</th>
						<th className={thClass}>Shipping</th>
						<th className={thClass}>Placed At</th>
						<th className={thClass}>Items</th>
						<th className={thClass} />
					</tr>
				</thead>
				<tbody>
					{items.map((item) => (
						<tr
							key={item.id}
							onClick={() => onRowClick(item)}
							className="border-b border-border last:border-0 hover:bg-default/50 transition-colors cursor-pointer"
						>
							<td
								className={`${tdClass} font-mono text-xs text-foreground font-medium`}
							>
								{item.orderNumber}
							</td>
							<td className={tdClass}>
								<div>
									<p className="text-sm font-medium text-foreground">
										{item.customer.name}
									</p>
									<p className="text-xs text-muted">{item.customer.email}</p>
								</div>
							</td>
							<td className={`${tdClass} font-medium text-foreground`}>
								{formatCurrency(item.totalAmount)}
							</td>
							<td className={tdClass}>
								<Chip
									variant="soft"
									color={orderStatusColors[item.status]}
									size="sm"
								>
									{orderStatusLabels[item.status]}
								</Chip>
							</td>
							<td className={tdClass}>
								<Chip
									variant="soft"
									color={paymentStatusColors[item.payment.status]}
									size="sm"
								>
									{paymentStatusLabels[item.payment.status]}
								</Chip>
							</td>
							<td className={tdClass}>
								<Chip
									variant="soft"
									color={shippingStatusColors[item.shipping.status]}
									size="sm"
								>
									{shippingStatusLabels[item.shipping.status]}
								</Chip>
							</td>
							<td className={`${tdClass} text-muted whitespace-nowrap`}>
								{formatDate(item.placedAt)}
							</td>
							<td className={`${tdClass} text-muted text-center`}>
								{item.itemCount}
							</td>
							<td
								className={tdClass}
								onClick={(e) => e.stopPropagation()}
								onKeyDown={(e) => e.stopPropagation()}
							>
								<div className="flex items-center">
									<button
										type="button"
										onClick={() => onRowClick(item)}
										className={iconBtnClass}
										aria-label="View order details"
									>
										<Eye size={13} />
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export function OrdersList({ items, onRowClick }: OrdersTableProps) {
	if (items.length === 0) {
		return (
			<div className="py-16 flex flex-col items-center gap-3 text-center">
				<Package size={28} className="text-muted" />
				<div>
					<p className="text-sm font-medium text-foreground">No orders found</p>
					<p className="text-xs text-muted mt-1">
						Try adjusting your filters or search term.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="divide-y divide-border">
			{items.map((item) => (
				<button
					key={item.id}
					type="button"
					onClick={() => onRowClick(item)}
					className="grid w-full gap-3 py-4 text-left transition-colors hover:bg-default/40 sm:grid-cols-[1fr_auto] sm:px-2"
				>
					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-2">
							<span className="font-mono text-xs font-medium text-foreground">
								{item.orderNumber}
							</span>
							<Chip
								variant="soft"
								color={orderStatusColors[item.status]}
								size="sm"
							>
								{orderStatusLabels[item.status]}
							</Chip>
						</div>
						<p className="mt-1 text-sm font-medium text-foreground">
							{item.customer.name}
						</p>
						<p className="text-xs text-muted">{item.customer.email}</p>
					</div>
					<div className="flex flex-wrap items-center gap-2 sm:justify-end">
						<Chip
							variant="soft"
							color={paymentStatusColors[item.payment.status]}
							size="sm"
						>
							{paymentStatusLabels[item.payment.status]}
						</Chip>
						<Chip
							variant="soft"
							color={shippingStatusColors[item.shipping.status]}
							size="sm"
						>
							{shippingStatusLabels[item.shipping.status]}
						</Chip>
						<span className="text-sm font-semibold text-foreground">
							{formatCurrency(item.totalAmount)}
						</span>
						<span className="text-xs text-muted">
							{formatDate(item.placedAt)}
						</span>
					</div>
				</button>
			))}
		</div>
	);
}

export function OrdersCards({ items, onRowClick }: OrdersTableProps) {
	if (items.length === 0) {
		return (
			<div className="py-16 flex flex-col items-center gap-3 text-center">
				<Package size={28} className="text-muted" />
				<div>
					<p className="text-sm font-medium text-foreground">No orders found</p>
					<p className="text-xs text-muted mt-1">
						Try adjusting your filters or search term.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{items.map((item) => (
				<button
					key={item.id}
					type="button"
					onClick={() => onRowClick(item)}
					className="rounded-2xl border border-border bg-default/30 p-4 text-left transition-colors hover:border-accent/40 hover:bg-default/50"
				>
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0">
							<p className="font-mono text-xs font-medium text-muted">
								{item.orderNumber}
							</p>
							<p className="mt-1 truncate text-sm font-semibold text-foreground">
								{item.customer.name}
							</p>
						</div>
						<span className="text-sm font-bold text-foreground">
							{formatCurrency(item.totalAmount)}
						</span>
					</div>
					<div className="mt-4 flex flex-wrap gap-2">
						<Chip
							variant="soft"
							color={orderStatusColors[item.status]}
							size="sm"
						>
							{orderStatusLabels[item.status]}
						</Chip>
						<Chip
							variant="soft"
							color={paymentStatusColors[item.payment.status]}
							size="sm"
						>
							{paymentStatusLabels[item.payment.status]}
						</Chip>
						<Chip
							variant="soft"
							color={shippingStatusColors[item.shipping.status]}
							size="sm"
						>
							{shippingStatusLabels[item.shipping.status]}
						</Chip>
					</div>
					<div className="mt-4 flex items-center justify-between text-xs text-muted">
						<span>{formatDate(item.placedAt)}</span>
						<span>{item.itemCount} items</span>
					</div>
				</button>
			))}
		</div>
	);
}
