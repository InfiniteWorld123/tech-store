"use client";

import { Card } from "@heroui/react";
import type { LucideIcon } from "lucide-react";
import {
	Activity,
	AlertTriangle,
	Archive,
	Award,
	BadgePercent,
	BarChart2,
	CheckCircle2,
	Clock,
	CreditCard,
	DollarSign,
	MailWarning,
	Package,
	PackageCheck,
	PackageX,
	ShoppingBag,
	ShoppingCart,
	Star,
	TrendingDown,
	TrendingUp,
	Truck,
	Users,
	UserX,
	Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { AdminPageHeader } from "#/components/admin/sections/admin-page";
import type {
	GetCustomerMetricsOutputType,
	GetOrderMetricsOutputType,
	GetPaymentMetricsOutputType,
	GetProductMetricsOutputType,
	GetReviewMetricsOutputType,
	GetShippingMetricsOutputType,
} from "#/server/analytics/analytics.types";

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_MONTHLY_REVENUE = [
	{ month: "Jan", revenue: 18_400 },
	{ month: "Feb", revenue: 22_100 },
	{ month: "Mar", revenue: 19_800 },
	{ month: "Apr", revenue: 26_500 },
	{ month: "May", revenue: 31_200 },
	{ month: "Jun", revenue: 28_700 },
	{ month: "Jul", revenue: 34_900 },
	{ month: "Aug", revenue: 38_100 },
	{ month: "Sep", revenue: 29_400 },
	{ month: "Oct", revenue: 41_200 },
	{ month: "Nov", revenue: 52_800 },
	{ month: "Dec", revenue: 47_600 },
];

const MOCK_ORDER_METRICS: GetOrderMetricsOutputType = {
	overview: {
		totalOrders: 1_842,
		totalRevenue: 390_700,
		averageOrderValue: 212.1,
		activeOrders: 1_640,
		archivedOrders: 202,
	},
	byStatus: { pending: 184, processing: 312, completed: 1_218, cancelled: 128 },
};

const MOCK_PAYMENT_METRICS: GetPaymentMetricsOutputType = {
	totalPayments: 1_842,
	totalCollected: 365_400,
	totalRefunded: 12_800,
	totalPending: 8_200,
	totalFailed: 4_300,
	averagePaymentAmount: 208.5,
	byMethod: {
		card: 1_120,
		paypal: 380,
		bank_transfer: 210,
		cash_on_delivery: 132,
	},
	byStatus: { pending: 148, paid: 1_598, failed: 54, refunded: 42 },
};

const MOCK_SHIPPING_METRICS: GetShippingMetricsOutputType = {
	totalShipments: 1_694,
	averageDeliveryTime: 3.4,
	byStatus: {
		pending: 96,
		packed: 144,
		shipped: 210,
		in_transit: 314,
		delivered: 930,
	},
	byMethod: { standard: 1_012, express: 542, same_day: 140 },
	byCarrier: { dhl: 520, hermes: 310, ups: 482, fedex: 382 },
};

const MOCK_PRODUCT_METRICS: GetProductMetricsOutputType = {
	totalProducts: 148,
	activeProducts: 122,
	inactiveProducts: 26,
	featuredProducts: 18,
	bestsellerProducts: 24,
	totalVariants: 634,
	outOfStockVariants: 41,
	lowStockVariants: 78,
	averageProductRating: 4.2,
	totalReviewsAcrossProducts: 3_218,
	productsWithNoReviews: 22,
	productsWithDiscount: 54,
};

const MOCK_CUSTOMER_METRICS: GetCustomerMetricsOutputType = {
	totalCustomers: 2_840,
	verifiedCustomers: 2_410,
	unverifiedCustomers: 430,
	customersWithOrders: 1_980,
	customersWithoutOrders: 860,
	customersWithSavedAddresses: 1_640,
	customersWithReviews: 1_120,
};

const MOCK_REVIEW_METRICS: GetReviewMetricsOutputType = {
	totalReviews: 3_218,
	averageRating: 4.2,
	highestRatedProduct: 4.9,
	lowestRatedProduct: 2.1,
	productsWithReviews: 126,
	byStar: { one: 98, two: 156, three: 412, four: 1_014, five: 1_538 },
};

// ─── Formatters ────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
	return new Intl.NumberFormat("de-DE", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(value);
}

function formatNumber(value: number) {
	return value.toLocaleString();
}

function formatDays(value: number) {
	return `${value.toFixed(1)} days`;
}

function formatRating(value: number) {
	return `${value.toFixed(1)} / 5`;
}

// ─── Shared components ─────────────────────────────────────────────────────────

type StatCardDef = {
	bgClass: string;
	colorClass: string;
	Icon: LucideIcon;
	label: string;
	value: string;
};

function AnalyticsSection({
	children,
	Icon,
	title,
}: {
	children: ReactNode;
	Icon: LucideIcon;
	title: string;
}) {
	return (
		<section className="flex flex-col gap-4">
			<div className="flex items-center gap-2.5">
				<div className="flex size-8 items-center justify-center rounded-lg bg-accent/10">
					<Icon size={16} className="text-accent" />
				</div>
				<h2 className="text-base font-semibold text-foreground">{title}</h2>
			</div>
			{children}
		</section>
	);
}

function StatCardGrid({
	cards,
	cols,
}: {
	cards: StatCardDef[];
	cols: "4" | "6" | "8";
}) {
	const colsClass =
		cols === "8"
			? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8"
			: cols === "6"
				? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-6"
				: "grid-cols-2 sm:grid-cols-4";

	return (
		<div className={`grid gap-4 ${colsClass}`}>
			{cards.map((card) => (
				<Card key={card.label}>
					<Card.Content className="flex items-center gap-3 p-3">
						<div className={`rounded-xl p-2.5 ${card.bgClass}`}>
							<card.Icon size={18} className={card.colorClass} />
						</div>
						<div className="min-w-0">
							<p className="truncate text-lg font-bold text-foreground">
								{card.value}
							</p>
							<p className="mt-0.5 truncate text-xs text-muted">{card.label}</p>
						</div>
					</Card.Content>
				</Card>
			))}
		</div>
	);
}

function ChartCard({
	children,
	className = "",
	title,
}: {
	children: ReactNode;
	className?: string;
	title: string;
}) {
	return (
		<Card className={className}>
			<Card.Header className="px-5 pt-5 pb-3">
				<Card.Title className="text-sm font-semibold text-foreground">
					{title}
				</Card.Title>
			</Card.Header>
			<Card.Content className="px-5 pb-5 pt-0">{children}</Card.Content>
		</Card>
	);
}

// ─── Chart: Donut ──────────────────────────────────────────────────────────────

type DonutEntry = { color: string; name: string; value: number };

const TOOLTIP_STYLE = {
	borderRadius: "8px",
	fontSize: "12px",
	border: "1px solid #e5e7eb",
};

function DonutChart({
	className,
	data,
	title,
}: {
	className?: string;
	data: DonutEntry[];
	title: string;
}) {
	const total = data.reduce((s, d) => s + d.value, 0);

	return (
		<ChartCard title={title} className={className}>
			<ResponsiveContainer width="100%" height={260}>
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={62}
						outerRadius={92}
						paddingAngle={2}
						dataKey="value"
					>
						{data.map((entry) => (
							<Cell key={entry.name} fill={entry.color} stroke="transparent" />
						))}
					</Pie>
					<Tooltip
						formatter={(value) => [
							`${formatNumber(value as number)} (${total > 0 ? Math.round(((value as number) / total) * 100) : 0}%)`,
						]}
						contentStyle={TOOLTIP_STYLE}
					/>
					<Legend
						formatter={(value) => (
							<span style={{ fontSize: "11px", color: "#94a3b8" }}>
								{value}
							</span>
						)}
					/>
				</PieChart>
			</ResponsiveContainer>
		</ChartCard>
	);
}

// ─── Chart: Area ───────────────────────────────────────────────────────────────

function RevenueAreaChart() {
	return (
		<ChartCard title="Monthly Revenue">
			<ResponsiveContainer width="100%" height={260}>
				<AreaChart
					data={MOCK_MONTHLY_REVENUE}
					margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
				>
					<defs>
						<linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
							<stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke="#e5e7eb"
						vertical={false}
					/>
					<XAxis
						dataKey="month"
						tick={{ fontSize: 11, fill: "#94a3b8" }}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						tickFormatter={(v) => `€${((v as number) / 1000).toFixed(0)}k`}
						tick={{ fontSize: 11, fill: "#94a3b8" }}
						axisLine={false}
						tickLine={false}
						width={44}
					/>
					<Tooltip
						formatter={(value) => [formatCurrency(value as number), "Revenue"]}
						contentStyle={TOOLTIP_STYLE}
					/>
					<Area
						type="monotone"
						dataKey="revenue"
						stroke="#6366f1"
						strokeWidth={2}
						fill="url(#revenueGradient)"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</ChartCard>
	);
}

// ─── Chart: Rating bar ─────────────────────────────────────────────────────────

function RatingBarChart() {
	const { byStar } = MOCK_REVIEW_METRICS;
	const data = [
		{ star: "5★", count: byStar.five },
		{ star: "4★", count: byStar.four },
		{ star: "3★", count: byStar.three },
		{ star: "2★", count: byStar.two },
		{ star: "1★", count: byStar.one },
	];

	return (
		<ChartCard title="Reviews by Star Rating">
			<ResponsiveContainer width="100%" height={200}>
				<BarChart
					data={data}
					layout="vertical"
					margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						horizontal={false}
						stroke="#e5e7eb"
					/>
					<XAxis
						type="number"
						tick={{ fontSize: 11, fill: "#94a3b8" }}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						type="category"
						dataKey="star"
						tick={{ fontSize: 11, fill: "#94a3b8" }}
						axisLine={false}
						tickLine={false}
						width={28}
					/>
					<Tooltip
						formatter={(value) => [formatNumber(value as number), "Reviews"]}
						contentStyle={TOOLTIP_STYLE}
					/>
					<Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</ChartCard>
	);
}

// ─── Top KPI strip ─────────────────────────────────────────────────────────────

function TopKpiCards() {
	const cards: StatCardDef[] = [
		{
			label: "Total Revenue",
			value: formatCurrency(MOCK_ORDER_METRICS.overview.totalRevenue),
			Icon: DollarSign,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Total Orders",
			value: formatNumber(MOCK_ORDER_METRICS.overview.totalOrders),
			Icon: ShoppingCart,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Total Customers",
			value: formatNumber(MOCK_CUSTOMER_METRICS.totalCustomers),
			Icon: Users,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "Avg Order Value",
			value: formatCurrency(MOCK_ORDER_METRICS.overview.averageOrderValue),
			Icon: TrendingUp,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
	];

	return <StatCardGrid cards={cards} cols="4" />;
}

// ─── Section: Orders & Revenue ─────────────────────────────────────────────────

function OrdersSection() {
	const { byStatus, overview } = MOCK_ORDER_METRICS;

	const cards: StatCardDef[] = [
		{
			label: "Total Orders",
			value: formatNumber(overview.totalOrders),
			Icon: ShoppingCart,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Total Revenue",
			value: formatCurrency(overview.totalRevenue),
			Icon: DollarSign,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Avg Order Value",
			value: formatCurrency(overview.averageOrderValue),
			Icon: TrendingUp,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "Active Orders",
			value: formatNumber(overview.activeOrders),
			Icon: ShoppingBag,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Archived",
			value: formatNumber(overview.archivedOrders),
			Icon: Archive,
			colorClass: "text-muted",
			bgClass: "bg-default",
		},
		{
			label: "Cancelled",
			value: formatNumber(byStatus.cancelled),
			Icon: PackageX,
			colorClass: "text-danger",
			bgClass: "bg-danger/10",
		},
	];

	const statusData: DonutEntry[] = [
		{ name: "Completed", value: byStatus.completed, color: "#22c55e" },
		{ name: "Processing", value: byStatus.processing, color: "#6366f1" },
		{ name: "Pending", value: byStatus.pending, color: "#f59e0b" },
		{ name: "Cancelled", value: byStatus.cancelled, color: "#ef4444" },
	];

	return (
		<AnalyticsSection Icon={ShoppingCart} title="Orders & Revenue">
			<StatCardGrid cards={cards} cols="6" />
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<RevenueAreaChart />
				<DonutChart title="Orders by Status" data={statusData} />
			</div>
		</AnalyticsSection>
	);
}

// ─── Section: Payments ────────────────────────────────────────────────────────

function PaymentsSection() {
	const m = MOCK_PAYMENT_METRICS;

	const cards: StatCardDef[] = [
		{
			label: "Total Payments",
			value: formatNumber(m.totalPayments),
			Icon: CreditCard,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Total Collected",
			value: formatCurrency(m.totalCollected),
			Icon: Wallet,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Total Refunded",
			value: formatCurrency(m.totalRefunded),
			Icon: TrendingDown,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "Pending",
			value: formatCurrency(m.totalPending),
			Icon: Clock,
			colorClass: "text-muted",
			bgClass: "bg-default",
		},
		{
			label: "Failed",
			value: formatCurrency(m.totalFailed),
			Icon: AlertTriangle,
			colorClass: "text-danger",
			bgClass: "bg-danger/10",
		},
		{
			label: "Avg Payment",
			value: formatCurrency(m.averagePaymentAmount),
			Icon: Activity,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
	];

	const methodData: DonutEntry[] = [
		{ name: "Card", value: m.byMethod.card, color: "#6366f1" },
		{ name: "PayPal", value: m.byMethod.paypal, color: "#3b82f6" },
		{
			name: "Bank Transfer",
			value: m.byMethod.bank_transfer,
			color: "#14b8a6",
		},
		{
			name: "Cash on Delivery",
			value: m.byMethod.cash_on_delivery,
			color: "#f59e0b",
		},
	];

	const statusData: DonutEntry[] = [
		{ name: "Paid", value: m.byStatus.paid, color: "#22c55e" },
		{ name: "Pending", value: m.byStatus.pending, color: "#f59e0b" },
		{ name: "Failed", value: m.byStatus.failed, color: "#ef4444" },
		{ name: "Refunded", value: m.byStatus.refunded, color: "#94a3b8" },
	];

	return (
		<AnalyticsSection Icon={CreditCard} title="Payments">
			<StatCardGrid cards={cards} cols="6" />
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<DonutChart title="By Payment Method" data={methodData} />
				<DonutChart title="By Payment Status" data={statusData} />
			</div>
		</AnalyticsSection>
	);
}

// ─── Section: Shipping ────────────────────────────────────────────────────────

function ShippingSection() {
	const m = MOCK_SHIPPING_METRICS;

	const cards: StatCardDef[] = [
		{
			label: "Total Shipments",
			value: formatNumber(m.totalShipments),
			Icon: Truck,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Avg Delivery Time",
			value: formatDays(m.averageDeliveryTime),
			Icon: Clock,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Delivered",
			value: formatNumber(m.byStatus.delivered),
			Icon: PackageCheck,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "In Transit",
			value: formatNumber(m.byStatus.in_transit),
			Icon: Activity,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
	];

	const statusData: DonutEntry[] = [
		{ name: "Delivered", value: m.byStatus.delivered, color: "#22c55e" },
		{ name: "In Transit", value: m.byStatus.in_transit, color: "#6366f1" },
		{ name: "Shipped", value: m.byStatus.shipped, color: "#3b82f6" },
		{ name: "Packed", value: m.byStatus.packed, color: "#f59e0b" },
		{ name: "Pending", value: m.byStatus.pending, color: "#94a3b8" },
	];

	const carrierData: DonutEntry[] = [
		{ name: "DHL", value: m.byCarrier.dhl, color: "#f59e0b" },
		{ name: "UPS", value: m.byCarrier.ups, color: "#6366f1" },
		{ name: "FedEx", value: m.byCarrier.fedex, color: "#ef4444" },
		{ name: "Hermes", value: m.byCarrier.hermes, color: "#22c55e" },
	];

	const methodData: DonutEntry[] = [
		{ name: "Standard", value: m.byMethod.standard, color: "#94a3b8" },
		{ name: "Express", value: m.byMethod.express, color: "#6366f1" },
		{ name: "Same Day", value: m.byMethod.same_day, color: "#f59e0b" },
	];

	return (
		<AnalyticsSection Icon={Truck} title="Shipping">
			<StatCardGrid cards={cards} cols="4" />
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<DonutChart title="By Status" data={statusData} />
				<DonutChart title="By Carrier" data={carrierData} />
				<DonutChart title="By Method" data={methodData} />
			</div>
		</AnalyticsSection>
	);
}

// ─── Section: Products ────────────────────────────────────────────────────────

function ProductsSection() {
	const m = MOCK_PRODUCT_METRICS;
	const inStockVariants =
		m.totalVariants - m.outOfStockVariants - m.lowStockVariants;

	const cards: StatCardDef[] = [
		{
			label: "Total Products",
			value: formatNumber(m.totalProducts),
			Icon: Package,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Active",
			value: formatNumber(m.activeProducts),
			Icon: CheckCircle2,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Inactive",
			value: formatNumber(m.inactiveProducts),
			Icon: PackageX,
			colorClass: "text-danger",
			bgClass: "bg-danger/10",
		},
		{
			label: "Featured",
			value: formatNumber(m.featuredProducts),
			Icon: Star,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "Bestsellers",
			value: formatNumber(m.bestsellerProducts),
			Icon: Award,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Out of Stock",
			value: formatNumber(m.outOfStockVariants),
			Icon: AlertTriangle,
			colorClass: "text-danger",
			bgClass: "bg-danger/10",
		},
		{
			label: "Low Stock",
			value: formatNumber(m.lowStockVariants),
			Icon: PackageCheck,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "With Discount",
			value: formatNumber(m.productsWithDiscount),
			Icon: BadgePercent,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
	];

	const statusData: DonutEntry[] = [
		{ name: "Active", value: m.activeProducts, color: "#22c55e" },
		{ name: "Inactive", value: m.inactiveProducts, color: "#ef4444" },
	];

	const stockData: DonutEntry[] = [
		{ name: "In Stock", value: inStockVariants, color: "#22c55e" },
		{ name: "Low Stock", value: m.lowStockVariants, color: "#f59e0b" },
		{ name: "Out of Stock", value: m.outOfStockVariants, color: "#ef4444" },
	];

	return (
		<AnalyticsSection Icon={Package} title="Products">
			<StatCardGrid cards={cards} cols="8" />
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<DonutChart title="Product Status" data={statusData} />
				<DonutChart title="Variant Stock Health" data={stockData} />
			</div>
		</AnalyticsSection>
	);
}

// ─── Section: Customers ───────────────────────────────────────────────────────

function CustomersSection() {
	const m = MOCK_CUSTOMER_METRICS;

	const cards: StatCardDef[] = [
		{
			label: "Total Customers",
			value: formatNumber(m.totalCustomers),
			Icon: Users,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Verified",
			value: formatNumber(m.verifiedCustomers),
			Icon: CheckCircle2,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Unverified",
			value: formatNumber(m.unverifiedCustomers),
			Icon: MailWarning,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "With Orders",
			value: formatNumber(m.customersWithOrders),
			Icon: ShoppingBag,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Without Orders",
			value: formatNumber(m.customersWithoutOrders),
			Icon: UserX,
			colorClass: "text-muted",
			bgClass: "bg-default",
		},
		{
			label: "With Reviews",
			value: formatNumber(m.customersWithReviews),
			Icon: Star,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
	];

	const engagementData: DonutEntry[] = [
		{ name: "With Orders", value: m.customersWithOrders, color: "#6366f1" },
		{ name: "With Reviews", value: m.customersWithReviews, color: "#22c55e" },
		{
			name: "With Addresses",
			value: m.customersWithSavedAddresses,
			color: "#14b8a6",
		},
		{ name: "No Orders", value: m.customersWithoutOrders, color: "#94a3b8" },
	];

	const verificationData: DonutEntry[] = [
		{ name: "Verified", value: m.verifiedCustomers, color: "#22c55e" },
		{ name: "Unverified", value: m.unverifiedCustomers, color: "#f59e0b" },
	];

	return (
		<AnalyticsSection Icon={Users} title="Customers">
			<StatCardGrid cards={cards} cols="6" />
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<DonutChart title="Customer Engagement" data={engagementData} />
				<DonutChart title="Email Verification" data={verificationData} />
			</div>
		</AnalyticsSection>
	);
}

// ─── Section: Reviews & Ratings ───────────────────────────────────────────────

function ReviewsSection() {
	const m = MOCK_REVIEW_METRICS;

	const cards: StatCardDef[] = [
		{
			label: "Total Reviews",
			value: formatNumber(m.totalReviews),
			Icon: BarChart2,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Avg Rating",
			value: formatRating(m.averageRating),
			Icon: Star,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "Products Reviewed",
			value: formatNumber(m.productsWithReviews),
			Icon: Package,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Highest Rated",
			value: formatRating(m.highestRatedProduct),
			Icon: Award,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
	];

	return (
		<AnalyticsSection Icon={Star} title="Reviews & Ratings">
			<StatCardGrid cards={cards} cols="4" />
			<RatingBarChart />
		</AnalyticsSection>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AnalyticsPage() {
	return (
		<div className="flex flex-col gap-8">
			<AdminPageHeader
				title="Analytics"
				description="Store performance overview"
			/>

			<TopKpiCards />

			<OrdersSection />
			<PaymentsSection />
			<ShippingSection />
			<ProductsSection />
			<CustomersSection />
			<ReviewsSection />
		</div>
	);
}
