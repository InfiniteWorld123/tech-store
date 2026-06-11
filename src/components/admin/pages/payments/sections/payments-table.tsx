"use client";

import { Button, Chip } from "@heroui/react";
import { useRefundPayment } from "#/mutations/payments/use-refund-payment";
import type { PaymentListItemType } from "#/server/payments/payments.types";

const methodLabels: Record<PaymentListItemType["method"], string> = {
	card: "Card",
	paypal: "PayPal",
	bank_transfer: "Bank Transfer",
	cash_on_delivery: "Cash on Delivery",
};

const statusColors: Record<
	PaymentListItemType["status"],
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
	items: PaymentListItemType[];
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
