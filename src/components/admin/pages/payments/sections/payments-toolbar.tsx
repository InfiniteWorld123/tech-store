import { CreditCard, Search } from "lucide-react";
import type { PaymentMethod, PaymentStatus } from "../payments.types";

type PaymentsToolbarProps = {
	search: string;
	onSearchChange: (value: string) => void;
	status: PaymentStatus | undefined;
	onStatusChange: (value: string) => void;
	onPrefetchStatus: (value: string) => void;
	method: PaymentMethod | undefined;
	onMethodChange: (value: string) => void;
	onPrefetchMethod: (value: string) => void;
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
	"w-full min-w-0 appearance-none pl-9 pr-8 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all cursor-pointer";

export function PaymentsToolbar({
	search,
	onSearchChange,
	status,
	onStatusChange,
	onPrefetchStatus,
	method,
	onMethodChange,
	onPrefetchMethod,
}: PaymentsToolbarProps) {
	const warmStatuses = () => {
		for (const { value } of statusOptions) {
			onPrefetchStatus(value);
		}
	};
	const warmMethods = () => {
		for (const { value } of methodOptions) {
			onPrefetchMethod(value);
		}
	};

	return (
		<div className="grid w-full min-w-0 grid-cols-1 gap-3 min-[520px]:grid-cols-2 xl:flex xl:items-center">
			<div className="relative min-w-0 min-[520px]:col-span-2 xl:col-span-1 xl:flex-1">
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

			<div className="relative min-w-0">
				<CreditCard
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
				/>
				<select
					value={status ?? ""}
					onChange={(e) => onStatusChange(e.target.value)}
					onFocus={warmStatuses}
					onMouseEnter={warmStatuses}
					className={selectClass}
				>
					{statusOptions.map(({ value, label }) => (
						<option key={label} value={value}>
							{label}
						</option>
					))}
				</select>
			</div>

			<div className="relative min-w-0">
				<CreditCard
					size={15}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
				/>
				<select
					value={method ?? ""}
					onChange={(e) => onMethodChange(e.target.value)}
					onFocus={warmMethods}
					onMouseEnter={warmMethods}
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
