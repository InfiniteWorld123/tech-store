import { CreditCard, Search } from "lucide-react";
import type { PaymentMethod, PaymentStatus } from "../payments.types";

type PaymentsToolbarProps = {
	search: string;
	onSearchChange: (value: string) => void;
	status: PaymentStatus | undefined;
	onStatusChange: (value: string) => void;
	method: PaymentMethod | undefined;
	onMethodChange: (value: string) => void;
};

const statusOptions = [
	{ value: "", label: "All statuses" },
	{ value: "paid", label: "Paid" },
	{ value: "pending", label: "Pending" },
	{ value: "failed", label: "Failed" },
	{ value: "refunded", label: "Refunded" },
];

const methodOptions = [
	{ value: "", label: "All methods" },
	{ value: "card", label: "Card" },
	{ value: "paypal", label: "PayPal" },
	{ value: "bank_transfer", label: "Bank Transfer" },
	{ value: "cash_on_delivery", label: "Cash on Delivery" },
];

const selectClass =
	"appearance-none pl-9 pr-8 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all cursor-pointer";

export function PaymentsToolbar({
	search,
	onSearchChange,
	status,
	onStatusChange,
	method,
	onMethodChange,
}: PaymentsToolbarProps) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center gap-3">
			<div className="relative flex-1">
				<Search
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
				/>
				<input
					type="text"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search by order number..."
					className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
				/>
			</div>

			<div className="relative">
				<CreditCard
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
				/>
				<select
					value={status ?? ""}
					onChange={(e) => onStatusChange(e.target.value)}
					className={selectClass}
				>
					{statusOptions.map(({ value, label }) => (
						<option key={label} value={value}>
							{label}
						</option>
					))}
				</select>
			</div>

			<div className="relative">
				<CreditCard
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
				/>
				<select
					value={method ?? ""}
					onChange={(e) => onMethodChange(e.target.value)}
					className={selectClass}
				>
					{methodOptions.map(({ value, label }) => (
						<option key={label} value={value}>
							{label}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}
