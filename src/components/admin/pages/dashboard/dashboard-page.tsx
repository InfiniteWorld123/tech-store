import { Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import {
	BarChart2,
	CheckCircle2,
	ChevronRight,
	CreditCard,
	DollarSign,
	Layers,
	Package,
	Settings,
	ShoppingBag,
	Star,
	Truck,
	Users,
} from "lucide-react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import {
	customerMetricsQueryOptions,
	orderMetricsQueryOptions,
	paymentsMetricsQueryOptions,
	productMetricsQueryOptions,
	shippingMetricsQueryOptions,
} from "#/queries/analytics.queries";
import { HorizontalBarChart } from "../analytics/sections/horizontal-bar-chart";
import { StatCard } from "../analytics/sections/stat-card";

const TODAY = new Date().toLocaleDateString("en-US", {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
});

const QUICK_ACTIONS = [
	{ label: "Products", icon: Package, href: "/admin/products" },
	{ label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
	{ label: "Shipping", icon: Truck, href: "/admin/shipping" },
	{ label: "Payments", icon: CreditCard, href: "/admin/payments" },
	{ label: "Reviews", icon: Star, href: "/admin/reviews" },
	{ label: "Categories", icon: Layers, href: "/admin/categories" },
	{ label: "Analytics", icon: BarChart2, href: "/admin/analytics" },
	{ label: "Settings", icon: Settings, href: "/admin/settings" },
] as const;

export function DashboardPage() {
	const {
		data: orderMetrics,
		isLoading: isLoadingOrders,
		isError: isErrorOrders,
	} = useQuery(orderMetricsQueryOptions());

	const {
		data: productMetrics,
		isLoading: isLoadingProducts,
		isError: isErrorProducts,
	} = useQuery(productMetricsQueryOptions());

	const {
		data: customerMetrics,
		isLoading: isLoadingCustomers,
		isError: isErrorCustomers,
	} = useQuery(customerMetricsQueryOptions());

	const { data: paymentMetrics, isLoading: isLoadingPayments } = useQuery(
		paymentsMetricsQueryOptions(),
	);

	const {
		data: shippingMetrics,
		isLoading: isLoadingShipping,
		isError: isErrorShipping,
	} = useQuery(shippingMetricsQueryOptions());

	// ── Attention items ───────────────────────────────────────────────────────
	const outOfStock = productMetrics?.data.outOfStockVariants ?? 0;
	const pendingPayments = paymentMetrics?.data.totalPending ?? 0;
	const pendingOrders = orderMetrics?.data.byStatus.pending ?? 0;
	const processingOrders = orderMetrics?.data.byStatus.processing ?? 0;
	const unshipped =
		(shippingMetrics?.data.byStatus.pending ?? 0) +
		(shippingMetrics?.data.byStatus.packed ?? 0);
	const lowStock = productMetrics?.data.lowStockVariants ?? 0;

	const attentionItems = [
		{
			label: "Out of stock variants",
			count: outOfStock,
			severity: "danger" as const,
			href: "/admin/products",
		},
		{
			label: "Pending payments",
			count: pendingPayments,
			severity: "danger" as const,
			href: "/admin/payments",
		},
		{
			label: "Pending orders",
			count: pendingOrders,
			severity: "warning" as const,
			href: "/admin/orders",
		},
		{
			label: "Orders being processed",
			count: processingOrders,
			severity: "warning" as const,
			href: "/admin/orders",
		},
		{
			label: "Unshipped orders",
			count: unshipped,
			severity: "warning" as const,
			href: "/admin/shipping",
		},
		{
			label: "Low stock variants",
			count: lowStock,
			severity: "warning" as const,
			href: "/admin/products",
		},
	];

	const isLoadingAttention =
		isLoadingOrders ||
		isLoadingProducts ||
		isLoadingPayments ||
		isLoadingShipping;

	const allClear =
		!isLoadingAttention && attentionItems.every((item) => item.count === 0);

	// ── Pipeline data ─────────────────────────────────────────────────────────
	const orderPipelineData = [
		{ name: "pending", value: orderMetrics?.data.byStatus.pending ?? 0 },
		{ name: "processing", value: orderMetrics?.data.byStatus.processing ?? 0 },
		{ name: "completed", value: orderMetrics?.data.byStatus.completed ?? 0 },
		{ name: "cancelled", value: orderMetrics?.data.byStatus.cancelled ?? 0 },
	];

	const shippingPipelineData = [
		{ name: "pending", value: shippingMetrics?.data.byStatus.pending ?? 0 },
		{ name: "packed", value: shippingMetrics?.data.byStatus.packed ?? 0 },
		{ name: "shipped", value: shippingMetrics?.data.byStatus.shipped ?? 0 },
		{
			name: "in transit",
			value: shippingMetrics?.data.byStatus.in_transit ?? 0,
		},
		{ name: "delivered", value: shippingMetrics?.data.byStatus.delivered ?? 0 },
	];

	return (
		<div className="space-y-6 py-6">
			{/* ── Header ── */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-xl font-bold text-foreground">Welcome back</h1>
					<p className="mt-0.5 text-sm text-muted">{TODAY}</p>
					<p className="mt-1 text-sm text-muted">
						Here's what's happening in your store.
					</p>
				</div>
				<LinkAnchor
					to="/admin/analytics"
					className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-muted shadow-sm transition-colors hover:bg-default hover:text-foreground no-underline"
				>
					View Full Analytics
					<ChevronRight size={14} />
				</LinkAnchor>
			</div>

			{/* ── Hero KPIs ── */}
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
				<StatCard
					label="Total Revenue"
					icon={DollarSign}
					color="success"
					isLoading={isLoadingOrders}
					isError={isErrorOrders}
				>
					<p className="text-2xl font-bold text-foreground">
						${orderMetrics?.data.overview.totalRevenue.toLocaleString() ?? "0"}
					</p>
				</StatCard>

				<StatCard
					label="Total Orders"
					icon={ShoppingBag}
					color="accent"
					isLoading={isLoadingOrders}
					isError={isErrorOrders}
				>
					<p className="text-2xl font-bold text-foreground">
						{orderMetrics?.data.overview.totalOrders ?? 0}
					</p>
				</StatCard>

				<StatCard
					label="Total Customers"
					icon={Users}
					color="accent"
					isLoading={isLoadingCustomers}
					isError={isErrorCustomers}
				>
					<p className="text-2xl font-bold text-foreground">
						{customerMetrics?.data.totalCustomers ?? 0}
					</p>
				</StatCard>

				<StatCard
					label="Total Products"
					icon={Package}
					color="accent"
					isLoading={isLoadingProducts}
					isError={isErrorProducts}
				>
					<p className="text-2xl font-bold text-foreground">
						{productMetrics?.data.totalProducts ?? 0}
					</p>
				</StatCard>
			</div>

			{/* ── Middle row ── */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{/* Needs Attention */}
				<div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm lg:col-span-2">
					<p className="text-sm font-medium text-muted">Needs Attention</p>

					{isLoadingAttention ? (
						<div className="space-y-3">
							{[1, 2, 3, 4].map((i) => (
								<Skeleton key={i} className="h-12 w-full rounded-xl" />
							))}
						</div>
					) : allClear ? (
						<div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-success">
							<CheckCircle2 size={32} />
							<p className="text-sm font-medium">Everything looks good</p>
							<p className="text-xs text-muted">
								No issues to address right now
							</p>
						</div>
					) : (
						<div>
							{attentionItems.map((item) => (
								<LinkAnchor
									key={item.label}
									to={item.href}
									className="-mx-2 flex items-center gap-3 rounded-xl border-b border-border px-2 py-3 transition-colors hover:bg-default/50 last:border-0 no-underline"
								>
									<span
										className={`size-2 shrink-0 rounded-full ${
											item.severity === "danger" ? "bg-danger" : "bg-warning"
										}`}
									/>
									<span className="flex-1 text-sm text-foreground">
										{item.label}
									</span>
									<span
										className={`text-sm font-bold ${
											item.severity === "danger"
												? "text-danger"
												: item.count > 0
													? "text-warning"
													: "text-muted"
										}`}
									>
										{item.count}
									</span>
									<ChevronRight size={14} className="shrink-0 text-muted" />
								</LinkAnchor>
							))}
						</div>
					)}
				</div>

				{/* Quick Actions */}
				<div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
					<p className="text-sm font-medium text-muted">Quick Actions</p>
					<div className="grid grid-cols-2 gap-2">
						{QUICK_ACTIONS.map(({ label, icon: Icon, href }) => (
							<LinkAnchor
								key={href}
								to={href}
								className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface p-3 text-center transition-colors hover:bg-default no-underline"
							>
								<Icon size={20} className="text-muted" />
								<span className="text-xs text-muted">{label}</span>
							</LinkAnchor>
						))}
					</div>
				</div>
			</div>

			{/* ── Pipeline charts ── */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<HorizontalBarChart
					title="Order Pipeline"
					data={orderPipelineData}
					isLoading={isLoadingOrders}
					isError={isErrorOrders}
					color="bg-accent"
				/>
				<HorizontalBarChart
					title="Shipping Pipeline"
					data={shippingPipelineData}
					isLoading={isLoadingShipping}
					isError={isErrorShipping}
					color="bg-success"
				/>
			</div>
		</div>
	);
}
