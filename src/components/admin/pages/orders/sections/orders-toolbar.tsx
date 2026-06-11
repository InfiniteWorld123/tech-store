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
	dateTo: string;
	setDateTo: (v: string) => void;
};

const selectClass =
	"appearance-none pl-9 pr-8 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all cursor-pointer";
const iconClass =
	"absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none";
const chevronClass =
	"absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none";
const dateClass =
	"appearance-none py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all";

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
	dateTo,
	setDateTo,
}: OrdersToolbarProps) {
	return (
		<div className="flex flex-wrap items-center gap-3">
			{/* Search */}
			<div className="relative flex-1 min-w-48">
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
			<div className="relative">
				<Package size={15} className={iconClass} />
				<select
					value={orderStatus}
					onChange={(e) => setOrderStatus(e.target.value)}
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
			<div className="relative">
				<CreditCard size={15} className={iconClass} />
				<select
					value={paymentStatus}
					onChange={(e) => setPaymentStatus(e.target.value)}
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
			<div className="relative">
				<Truck size={15} className={iconClass} />
				<select
					value={shippingStatus}
					onChange={(e) => setShippingStatus(e.target.value)}
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
			<div className="relative">
				<Building2 size={15} className={iconClass} />
				<select
					value={carrier}
					onChange={(e) => setCarrier(e.target.value)}
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
			<div className="flex items-center gap-2">
				<div className="relative">
					<Calendar size={15} className={iconClass} />
					<input
						type="date"
						value={dateFrom}
						onChange={(e) => setDateFrom(e.target.value)}
						className={`${dateClass} pl-9 pr-3`}
					/>
				</div>
				<span className="text-xs text-muted">to</span>
				<input
					type="date"
					value={dateTo}
					onChange={(e) => setDateTo(e.target.value)}
					className={`${dateClass} px-3`}
				/>
			</div>
		</div>
	);
}
