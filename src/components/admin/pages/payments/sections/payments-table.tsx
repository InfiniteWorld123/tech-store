"use client";

import { Button, Chip } from "@heroui/react";
import { useRefundPayment } from "#/mutations/payments/use-refund-payment";
import type { PaymentListItem } from "../payments.types";

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
	return new Date(iso).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

const thClass = "text-left py-3 px-2 text-xs font-semibold text-muted";
const tdClass = "py-3 px-2";

type PaymentsTableProps = {
	items: PaymentListItem[];
};

export function PaymentsTable({ items }: PaymentsTableProps) {
	const { mutate: refund, isPending, variables } = useRefundPayment();

	if (items.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-sm text-muted">No payments found.</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-border">
						<th className={thClass}>Order #</th>
						<th className={thClass}>Method</th>
						<th className={thClass}>Amount</th>
						<th className={thClass}>Status</th>
						<th className={thClass}>Paid At</th>
						<th className={thClass}>Created At</th>
						<th className={thClass}>Actions</th>
					</tr>
				</thead>
				<tbody>
					{items.map((item) => (
						<tr
							key={item.id}
							className="border-b border-border last:border-0 hover:bg-default/50 transition-colors"
						>
							<td className={`${tdClass} font-medium text-foreground`}>
								{item.orderNumber}
							</td>
							<td className={`${tdClass} text-muted`}>
								{methodLabels[item.method]}
							</td>
							<td className={`${tdClass} font-medium text-foreground`}>
								{formatAmount(item.amount, item.currency)}
							</td>
							<td className={tdClass}>
								<Chip variant="soft" color={statusColors[item.status]}>
									{item.status.charAt(0).toUpperCase() + item.status.slice(1)}
								</Chip>
							</td>
							<td className={`${tdClass} text-muted whitespace-nowrap`}>
								{formatDate(item.paidAt)}
							</td>
							<td className={`${tdClass} text-muted whitespace-nowrap`}>
								{formatDate(item.createdAt)}
							</td>
							<td className={tdClass}>
								{item.status === "paid" && (
									<Button
										variant="danger-soft"
										size="sm"
										isPending={isPending && variables?.orderId === item.orderId}
										onPress={() => refund({ orderId: item.orderId })}
									>
										Refund
									</Button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export function PaymentsList({ items }: PaymentsTableProps) {
	const { mutate: refund, isPending, variables } = useRefundPayment();

	if (items.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-sm text-muted">No payments found.</p>
			</div>
		);
	}

	return (
		<div className="divide-y divide-border">
			{items.map((item) => (
				<div
					key={item.id}
					className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
				>
					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-2">
							<p className="font-mono text-xs font-medium text-foreground">
								{item.orderNumber}
							</p>
							<Chip variant="soft" color={statusColors[item.status]}>
								{item.status.charAt(0).toUpperCase() + item.status.slice(1)}
							</Chip>
						</div>
						<p className="mt-1 text-sm text-muted">
							{methodLabels[item.method]} • Created {formatDate(item.createdAt)}
						</p>
					</div>
					<div className="flex items-center justify-between gap-3 sm:justify-end">
						<span className="text-sm font-semibold text-foreground">
							{formatAmount(item.amount, item.currency)}
						</span>
						{item.status === "paid" ? (
							<Button
								variant="danger-soft"
								size="sm"
								isPending={isPending && variables?.orderId === item.orderId}
								onPress={() => refund({ orderId: item.orderId })}
							>
								Refund
							</Button>
						) : null}
					</div>
				</div>
			))}
		</div>
	);
}

export function PaymentsCards({ items }: PaymentsTableProps) {
	const { mutate: refund, isPending, variables } = useRefundPayment();

	if (items.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-sm text-muted">No payments found.</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{items.map((item) => (
				<div
					key={item.id}
					className="rounded-2xl border border-border bg-default/30 p-4"
				>
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0">
							<p className="font-mono text-xs font-medium text-muted">
								{item.orderNumber}
							</p>
							<p className="mt-1 text-sm font-semibold text-foreground">
								{methodLabels[item.method]}
							</p>
						</div>
						<Chip variant="soft" color={statusColors[item.status]}>
							{item.status.charAt(0).toUpperCase() + item.status.slice(1)}
						</Chip>
					</div>
					<p className="mt-4 text-xl font-bold text-foreground">
						{formatAmount(item.amount, item.currency)}
					</p>
					<div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted">
						<span>Paid {formatDate(item.paidAt)}</span>
						{item.status === "paid" ? (
							<Button
								variant="danger-soft"
								size="sm"
								isPending={isPending && variables?.orderId === item.orderId}
								onPress={() => refund({ orderId: item.orderId })}
							>
								Refund
							</Button>
						) : null}
					</div>
				</div>
			))}
		</div>
	);
}
