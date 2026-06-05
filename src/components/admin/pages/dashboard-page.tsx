"use client";

import { Avatar, Card, Chip } from "@heroui/react";
import type { LucideIcon } from "lucide-react";
import {
	AlertTriangle,
	BarChart2,
	Clock,
	CreditCard,
	DollarSign,
	MailWarning,
	Package,
	PackageX,
	Settings,
	ShoppingCart,
	Star,
	Store,
	TrendingUp,
	Truck,
	Users,
	XCircle,
} from "lucide-react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

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

const MOCK_KPI = {
	totalRevenue: 390_700,
	totalOrders: 1_842,
	totalCustomers: 2_840,
	avgOrderValue: 212.1,
};

const MOCK_ALERTS = {
	outOfStock: 3,
	lowStock: 7,
	pendingOrders: 14,
	cancelledOrders: 6,
	failedPayments: 2,
	pendingPayments: 8,
	unverifiedCustomers: 43,
};

type OrderStatus = "cancelled" | "completed" | "pending" | "processing";

const MOCK_RECENT_ORDERS: {
	customer: string;
	date: string;
	id: string;
	status: OrderStatus;
	total: number;
}[] = [
	{
		id: "ORD-8821",
		customer: "Sophie Turner",
		status: "completed",
		total: 429.99,
		date: "2024-12-14",
	},
	{
		id: "ORD-8820",
		customer: "Marcus Webb",
		status: "processing",
		total: 189.5,
		date: "2024-12-14",
	},
	{
		id: "ORD-8819",
		customer: "Aisha Patel",
		status: "pending",
		total: 312.0,
		date: "2024-12-13",
	},
	{
		id: "ORD-8818",
		customer: "Liam Foster",
		status: "cancelled",
		total: 94.99,
		date: "2024-12-13",
	},
	{
		id: "ORD-8817",
		customer: "Elena Vasquez",
		status: "completed",
		total: 778.0,
		date: "2024-12-12",
	},
	{
		id: "ORD-8816",
		customer: "James Okafor",
		status: "processing",
		total: 215.75,
		date: "2024-12-12",
	},
	{
		id: "ORD-8815",
		customer: "Priya Nair",
		status: "pending",
		total: 540.0,
		date: "2024-12-11",
	},
	{
		id: "ORD-8814",
		customer: "Tom Lindqvist",
		status: "completed",
		total: 139.99,
		date: "2024-12-11",
	},
];

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

function formatDate(dateStr: string) {
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
	}).format(new Date(dateStr));
}

function getGreeting() {
	const hour = new Date().getHours();
	if (hour < 12) return "Good morning";
	if (hour < 17) return "Good afternoon";
	return "Good evening";
}

function getTodayFormatted() {
	return new Intl.DateTimeFormat("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date());
}

function getInitials(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

// ─── 1. Welcome Banner ────────────────────────────────────────────────────────

function WelcomeBanner() {
	const { cancelledOrders, failedPayments, lowStock, outOfStock, pendingOrders } =
		MOCK_ALERTS;
	const stockAlerts = outOfStock + lowStock;

	return (
		<Card>
			<Card.Content className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
						<Store size={20} className="text-accent" />
					</div>
					<div>
						<p className="text-lg font-semibold text-foreground">
							{getGreeting()}, Admin
						</p>
						<p className="text-xs text-muted">{getTodayFormatted()}</p>
					</div>
				</div>
				<div className="flex flex-wrap gap-2">
					{pendingOrders > 0 && (
						<Chip color="warning" size="sm" variant="flat">
							{pendingOrders} pending orders
						</Chip>
					)}
					{cancelledOrders > 0 && (
						<Chip color="danger" size="sm" variant="flat">
							{cancelledOrders} cancelled orders
						</Chip>
					)}
					{stockAlerts > 0 && (
						<Chip color="danger" size="sm" variant="flat">
							{stockAlerts} stock alerts
						</Chip>
					)}
					{failedPayments > 0 && (
						<Chip color="danger" size="sm" variant="flat">
							{failedPayments} failed payments
						</Chip>
					)}
				</div>
			</Card.Content>
		</Card>
	);
}

// ─── 2. KPI Strip ──────────────────────────────────────────────────────────────

type StatCardDef = {
	Icon: LucideIcon;
	bgClass: string;
	colorClass: string;
	label: string;
	value: string;
};

function KpiStrip() {
	const cards: StatCardDef[] = [
		{
			label: "Total Revenue",
			value: formatCurrency(MOCK_KPI.totalRevenue),
			Icon: DollarSign,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Total Orders",
			value: formatNumber(MOCK_KPI.totalOrders),
			Icon: ShoppingCart,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Total Customers",
			value: formatNumber(MOCK_KPI.totalCustomers),
			Icon: Users,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
		{
			label: "Avg Order Value",
			value: formatCurrency(MOCK_KPI.avgOrderValue),
			Icon: TrendingUp,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
	];

	return (
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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

// ─── 3a. Revenue Chart ────────────────────────────────────────────────────────

const TOOLTIP_STYLE = {
	borderRadius: "8px",
	fontSize: "12px",
	border: "1px solid #e5e7eb",
};

function RevenueChart() {
	return (
		<Card className="h-full">
			<Card.Header className="px-5 pt-5 pb-3">
				<Card.Title className="text-sm font-semibold text-foreground">
					Monthly Revenue
				</Card.Title>
			</Card.Header>
			<Card.Content className="px-5 pb-5 pt-0">
				<ResponsiveContainer width="100%" height={280}>
					<AreaChart
						data={MOCK_MONTHLY_REVENUE}
						margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
					>
						<defs>
							<linearGradient id="dashRevGradient" x1="0" y1="0" x2="0" y2="1">
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
							formatter={(value) => [
								formatCurrency(value as number),
								"Revenue",
							]}
							contentStyle={TOOLTIP_STYLE}
						/>
						<Area
							type="monotone"
							dataKey="revenue"
							stroke="#6366f1"
							strokeWidth={2}
							fill="url(#dashRevGradient)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</Card.Content>
		</Card>
	);
}

// ─── 3b. Alerts Panel ─────────────────────────────────────────────────────────

type AlertRowDef = {
	Icon: LucideIcon;
	bgClass: string;
	chipColor: "danger" | "default" | "warning";
	colorClass: string;
	count: number;
	label: string;
};

function AlertRow({
	Icon,
	bgClass,
	chipColor,
	colorClass,
	count,
	label,
}: AlertRowDef) {
	return (
		<div className="flex items-center justify-between gap-3 py-2">
			<div className="flex items-center gap-2.5">
				<div
					className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${bgClass}`}
				>
					<Icon size={13} className={colorClass} />
				</div>
				<span className="text-sm text-foreground">{label}</span>
			</div>
			<Chip color={chipColor} size="sm" variant="flat">
				{count}
			</Chip>
		</div>
	);
}

function AlertsPanel() {
	const m = MOCK_ALERTS;

	const alertGroups: { rows: AlertRowDef[]; title: string }[] = [
		{
			title: "Stock",
			rows: [
				{
					Icon: PackageX,
					bgClass: "bg-danger/10",
					colorClass: "text-danger",
					label: "Out of stock",
					count: m.outOfStock,
					chipColor: "danger",
				},
				{
					Icon: AlertTriangle,
					bgClass: "bg-warning/10",
					colorClass: "text-warning",
					label: "Low stock",
					count: m.lowStock,
					chipColor: "warning",
				},
			],
		},
		{
			title: "Orders",
			rows: [
				{
					Icon: Clock,
					bgClass: "bg-warning/10",
					colorClass: "text-warning",
					label: "Pending orders",
					count: m.pendingOrders,
					chipColor: "warning",
				},
				{
					Icon: XCircle,
					bgClass: "bg-danger/10",
					colorClass: "text-danger",
					label: "Cancelled orders",
					count: m.cancelledOrders,
					chipColor: "danger",
				},
			],
		},
		{
			title: "Payments",
			rows: [
				{
					Icon: XCircle,
					bgClass: "bg-danger/10",
					colorClass: "text-danger",
					label: "Failed payments",
					count: m.failedPayments,
					chipColor: "danger",
				},
				{
					Icon: Clock,
					bgClass: "bg-default",
					colorClass: "text-muted",
					label: "Pending payments",
					count: m.pendingPayments,
					chipColor: "default",
				},
			],
		},
		{
			title: "Customers",
			rows: [
				{
					Icon: MailWarning,
					bgClass: "bg-warning/10",
					colorClass: "text-warning",
					label: "Unverified emails",
					count: m.unverifiedCustomers,
					chipColor: "warning",
				},
			],
		},
	];

	return (
		<Card className="h-full">
			<Card.Header className="px-5 pt-5 pb-3">
				<div className="flex items-center gap-2">
					<div className="flex size-6 items-center justify-center rounded-lg bg-danger/10">
						<AlertTriangle size={13} className="text-danger" />
					</div>
					<Card.Title className="text-sm font-semibold text-foreground">
						Needs Attention
					</Card.Title>
				</div>
			</Card.Header>
			<Card.Content className="px-5 pb-5 pt-0">
				<div className="flex flex-col">
					{alertGroups.map((group, gi) => (
						<div key={group.title}>
							{gi > 0 && <div className="border-t border-border" />}
							<p className="pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted">
								{group.title}
							</p>
							{group.rows.map((row) => (
								<AlertRow key={row.label} {...row} />
							))}
						</div>
					))}
				</div>
			</Card.Content>
		</Card>
	);
}

// ─── 4. Recent Orders ─────────────────────────────────────────────────────────

const ORDER_STATUS_CONFIG: Record<
	OrderStatus,
	{ color: "accent" | "danger" | "success" | "warning"; label: string }
> = {
	completed: { color: "success", label: "Completed" },
	processing: { color: "accent", label: "Processing" },
	pending: { color: "warning", label: "Pending" },
	cancelled: { color: "danger", label: "Cancelled" },
};

function RecentOrdersList() {
	return (
		<Card>
			<Card.Header className="px-5 pt-5 pb-3">
				<div className="flex items-center gap-2">
					<div className="flex size-6 items-center justify-center rounded-lg bg-accent/10">
						<ShoppingCart size={13} className="text-accent" />
					</div>
					<Card.Title className="text-sm font-semibold text-foreground">
						Recent Orders
					</Card.Title>
				</div>
			</Card.Header>
			<Card.Content className="px-5 pb-5 pt-0">
				<div className="flex flex-col divide-y divide-border">
					{MOCK_RECENT_ORDERS.map((order) => {
						const { color, label } = ORDER_STATUS_CONFIG[order.status];
						return (
							<div
								key={order.id}
								className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
							>
								<Avatar className="size-8 shrink-0">
									<Avatar.Fallback className="bg-accent/20 text-xs font-semibold text-foreground">
										{getInitials(order.customer)}
									</Avatar.Fallback>
								</Avatar>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-foreground">
										{order.customer}
									</p>
									<p className="font-mono text-xs text-muted">{order.id}</p>
								</div>
								<Chip color={color} size="sm" variant="flat">
									{label}
								</Chip>
								<div className="shrink-0 text-right">
									<p className="text-sm font-semibold text-foreground">
										{formatCurrency(order.total)}
									</p>
									<p className="text-xs text-muted">{formatDate(order.date)}</p>
								</div>
							</div>
						);
					})}
				</div>
			</Card.Content>
		</Card>
	);
}

// ─── 5. Quick Nav Grid ────────────────────────────────────────────────────────

type NavCardDef = {
	Icon: LucideIcon;
	bgClass: string;
	colorClass: string;
	subtitle: string;
	title: string;
};

function QuickNavCard({
	Icon,
	bgClass,
	colorClass,
	subtitle,
	title,
}: NavCardDef) {
	return (
		<Card className="cursor-pointer transition-shadow hover:shadow-md">
			<Card.Content className="flex flex-col gap-3 p-4">
				<div
					className={`flex size-9 items-center justify-center rounded-xl ${bgClass}`}
				>
					<Icon size={18} className={colorClass} />
				</div>
				<div>
					<p className="text-sm font-semibold text-foreground">{title}</p>
					<p className="mt-0.5 text-xs text-muted">{subtitle}</p>
				</div>
			</Card.Content>
		</Card>
	);
}

function QuickNavGrid() {
	const navCards: NavCardDef[] = [
		{
			Icon: Package,
			bgClass: "bg-accent/10",
			colorClass: "text-accent",
			title: "Products",
			subtitle: "148 items",
		},
		{
			Icon: ShoppingCart,
			bgClass: "bg-success/10",
			colorClass: "text-success",
			title: "Orders",
			subtitle: "1,842 total",
		},
		{
			Icon: Users,
			bgClass: "bg-warning/10",
			colorClass: "text-warning",
			title: "Customers",
			subtitle: "2,840 users",
		},
		{
			Icon: CreditCard,
			bgClass: "bg-accent/10",
			colorClass: "text-accent",
			title: "Payments",
			subtitle: "1,842 txns",
		},
		{
			Icon: Truck,
			bgClass: "bg-success/10",
			colorClass: "text-success",
			title: "Shipping",
			subtitle: "1,694 shipments",
		},
		{
			Icon: Star,
			bgClass: "bg-warning/10",
			colorClass: "text-warning",
			title: "Reviews",
			subtitle: "3,218 reviews",
		},
		{
			Icon: BarChart2,
			bgClass: "bg-accent/10",
			colorClass: "text-accent",
			title: "Analytics",
			subtitle: "View reports",
		},
		{
			Icon: Settings,
			bgClass: "bg-default",
			colorClass: "text-muted",
			title: "Settings",
			subtitle: "Manage store",
		},
	];

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2.5">
				<div className="flex size-8 items-center justify-center rounded-lg bg-accent/10">
					<Store size={16} className="text-accent" />
				</div>
				<h2 className="text-base font-semibold text-foreground">
					Quick Access
				</h2>
			</div>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				{navCards.map((card) => (
					<QuickNavCard key={card.title} {...card} />
				))}
			</div>
		</div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function DashboardPage() {
	return (
		<div className="flex flex-col gap-6">
			<WelcomeBanner />
			<KpiStrip />
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<RevenueChart />
				</div>
				<AlertsPanel />
			</div>
			<RecentOrdersList />
			<QuickNavGrid />
		</div>
	);
}
