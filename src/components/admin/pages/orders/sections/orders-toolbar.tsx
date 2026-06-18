import {
	Building2,
	Calendar,
	ChevronDown,
	CreditCard,
	Package,
	Search,
	Truck,
} from "lucide-react";

type OrdersToolbarProps = {
	inputValue: string;
	setInputValue: (v: string) => void;
	orderStatus: string;
	setOrderStatus: (v: string) => void;
	paymentStatus: string;
	setPaymentStatus: (v: string) => void;
	shippingStatus: string;
	setShippingStatus: (v: string) => void;
	carrier: string;
	setCarrier: (v: string) => void;
	dateFrom: string;
	setDateFrom: (v: string) => void;
	prefetchDateFrom: (v: string) => void;
	dateTo: string;
	setDateTo: (v: string) => void;
	prefetchDateTo: (v: string) => void;
	prefetchOrderStatus: (v: string) => void;
	prefetchPaymentStatus: (v: string) => void;
	prefetchShippingStatus: (v: string) => void;
	prefetchCarrier: (v: string) => void;
};

const orderStatusOptions = [
	"",
	"pending",
	"processing",
	"completed",
	"cancelled",
];
const paymentStatusOptions = ["", "pending", "paid", "failed", "refunded"];
const shippingStatusOptions = [
	"",
	"pending",
	"packed",
	"shipped",
	"in_transit",
	"delivered",
];
const carrierOptions = ["", "dhl", "hermes", "ups", "fedex"];

const selectClass =
	"w-full min-w-0 appearance-none pl-9 pr-8 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all cursor-pointer";
const iconClass =
	"absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none";
const chevronClass =
	"absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none";
const dateClass =
	"w-full min-w-0 appearance-none py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all";

export function OrdersToolbar({
	inputValue,
	setInputValue,
	orderStatus,
	setOrderStatus,
	paymentStatus,
	setPaymentStatus,
	shippingStatus,
	setShippingStatus,
	carrier,
	setCarrier,
	dateFrom,
	setDateFrom,
	prefetchDateFrom,
	dateTo,
	setDateTo,
	prefetchDateTo,
	prefetchOrderStatus,
	prefetchPaymentStatus,
	prefetchShippingStatus,
	prefetchCarrier,
}: OrdersToolbarProps) {
	const warmOrderStatuses = () => {
		for (const value of orderStatusOptions) {
			prefetchOrderStatus(value);
		}
	};
	const warmPaymentStatuses = () => {
		for (const value of paymentStatusOptions) {
			prefetchPaymentStatus(value);
		}
	};
	const warmShippingStatuses = () => {
		for (const value of shippingStatusOptions) {
			prefetchShippingStatus(value);
		}
	};
	const warmCarriers = () => {
		for (const value of carrierOptions) {
			prefetchCarrier(value);
		}
	};

	return (
		<div className="grid w-full min-w-0 grid-cols-1 gap-3 min-[520px]:grid-cols-2 xl:flex xl:flex-wrap xl:items-center">
			{/* Search */}
			<div className="relative min-w-0 min-[520px]:col-span-2 xl:col-span-1 xl:flex-1">
				<Search size={15} className={iconClass} />
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Search by order #, customer..."
					className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
				/>
			</div>

			{/* Order Status */}
			<div className="relative min-w-0">
				<Package size={15} className={iconClass} />
				<select
					value={orderStatus}
					onChange={(e) => setOrderStatus(e.target.value)}
					onFocus={warmOrderStatuses}
					onMouseEnter={warmOrderStatuses}
					className={selectClass}
				>
					<option value="">All Statuses</option>
					<option value="pending">Pending</option>
					<option value="processing">Processing</option>
					<option value="completed">Completed</option>
					<option value="cancelled">Cancelled</option>
				</select>
				<ChevronDown size={12} className={chevronClass} />
			</div>

			{/* Payment Status */}
			<div className="relative min-w-0">
				<CreditCard size={15} className={iconClass} />
				<select
					value={paymentStatus}
					onChange={(e) => setPaymentStatus(e.target.value)}
					onFocus={warmPaymentStatuses}
					onMouseEnter={warmPaymentStatuses}
					className={selectClass}
				>
					<option value="">All Payments</option>
					<option value="pending">Pending</option>
					<option value="paid">Paid</option>
					<option value="failed">Failed</option>
					<option value="refunded">Refunded</option>
				</select>
				<ChevronDown size={12} className={chevronClass} />
			</div>

			{/* Shipping Status */}
			<div className="relative min-w-0">
				<Truck size={15} className={iconClass} />
				<select
					value={shippingStatus}
					onChange={(e) => setShippingStatus(e.target.value)}
					onFocus={warmShippingStatuses}
					onMouseEnter={warmShippingStatuses}
					className={selectClass}
				>
					<option value="">All Shipping</option>
					<option value="pending">Pending</option>
					<option value="packed">Packed</option>
					<option value="shipped">Shipped</option>
					<option value="in_transit">In Transit</option>
					<option value="delivered">Delivered</option>
				</select>
				<ChevronDown size={12} className={chevronClass} />
			</div>

			{/* Carrier */}
			<div className="relative min-w-0">
				<Building2 size={15} className={iconClass} />
				<select
					value={carrier}
					onChange={(e) => setCarrier(e.target.value)}
					onFocus={warmCarriers}
					onMouseEnter={warmCarriers}
					className={selectClass}
				>
					<option value="">All Carriers</option>
					<option value="dhl">DHL</option>
					<option value="hermes">Hermes</option>
					<option value="ups">UPS</option>
					<option value="fedex">FedEx</option>
				</select>
				<ChevronDown size={12} className={chevronClass} />
			</div>

			{/* Date range */}
			<div className="grid min-w-0 grid-cols-1 gap-2 min-[420px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] min-[420px]:items-center min-[520px]:col-span-2 xl:col-span-1">
				<div className="relative min-w-0">
					<Calendar size={15} className={iconClass} />
					<input
						type="date"
						value={dateFrom}
						onChange={(e) => {
							prefetchDateFrom(e.target.value);
							setDateFrom(e.target.value);
						}}
						onFocus={() => prefetchDateFrom(dateFrom)}
						className={`${dateClass} pl-9 pr-3`}
					/>
				</div>
				<span className="hidden justify-self-center text-xs text-muted min-[420px]:block">
					to
				</span>
				<input
					type="date"
					value={dateTo}
					onChange={(e) => {
						prefetchDateTo(e.target.value);
						setDateTo(e.target.value);
					}}
					onFocus={() => prefetchDateTo(dateTo)}
					className={`${dateClass} px-3`}
				/>
			</div>
		</div>
	);
}
