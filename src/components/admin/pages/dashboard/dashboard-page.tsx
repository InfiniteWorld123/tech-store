import { Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import {
	BarChart2,
	CheckCircle2,
	ChevronRight,
	Clock,
	CreditCard,
	DollarSign,
	Layers,
	Package,
	PackageX,
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
			icon: PackageX,
		},
		{
			label: "Pending payments",
			count: pendingPayments,
			severity: "danger" as const,
			href: "/admin/payments",
			icon: CreditCard,
		},
		{
			label: "Pending orders",
			count: pendingOrders,
			severity: "warning" as const,
			href: "/admin/orders",
			icon: ShoppingBag,
		},
		{
			label: "Orders being processed",
			count: processingOrders,
			severity: "warning" as const,
			href: "/admin/orders",
			icon: Clock,
		},
		{
			label: "Unshipped orders",
			count: unshipped,
			severity: "warning" as const,
			href: "/admin/shipping",
			icon: Truck,
		},
		{
			label: "Low stock variants",
			count: lowStock,
			severity: "warning" as const,
			href: "/admin/products",
			icon: Package,
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
		<div className="space-y-4 py-4 sm:space-y-6 sm:py-6">
			{/* ── Header ── */}
			<div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0">
					<h1 className="text-xl font-bold text-foreground">Welcome back</h1>
					<p className="mt-0.5 text-sm text-muted">{TODAY}</p>
					<p className="mt-1 text-sm text-muted">
						Here's what's happening in your store.
					</p>
				</div>
				<LinkAnchor
					to="/admin/analytics"
					className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-muted shadow-sm transition-colors hover:bg-default hover:text-foreground no-underline sm:w-auto"
				>
					View Full Analytics
					<ChevronRight size={14} />
				</LinkAnchor>
			</div>

			{/* ── Hero KPIs ── */}
			<div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4">
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
				<div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5 lg:col-span-2">
					<div className="flex min-w-0 items-center justify-between gap-3">
						<div className="min-w-0">
							<p className="text-sm font-semibold text-foreground">
								Needs Attention
							</p>
							<p className="mt-0.5 text-xs text-muted">
								Items that need a quick review
							</p>
						</div>
						<span className="shrink-0 rounded-full border border-border bg-default/50 px-2.5 py-1 text-xs font-semibold text-muted">
							{attentionItems.filter((item) => item.count > 0).length}
						</span>
					</div>

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
						<div className="grid grid-cols-1 gap-2.5">
							{attentionItems.map((item) => {
								const Icon = item.icon;
								const isDanger = item.severity === "danger";
								return (
									<LinkAnchor
										key={item.label}
										to={item.href}
										className={`group flex min-h-16 w-full min-w-0 items-center gap-3 rounded-2xl border px-3.5 py-3 text-left shadow-sm ring-1 ring-transparent transition-all no-underline ${
											isDanger
												? "border-danger/20 bg-danger/5 hover:border-danger/35 hover:bg-danger/10 hover:ring-danger/10"
												: "border-warning/25 bg-warning/5 hover:border-warning/40 hover:bg-warning/10 hover:ring-warning/10"
										}`}
									>
										<span
											className={`flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm transition-colors ${
												isDanger
													? "bg-danger/10 text-danger group-hover:bg-danger group-hover:text-white"
													: "bg-warning/10 text-warning group-hover:bg-warning group-hover:text-white"
											}`}
										>
											<Icon size={18} />
										</span>
										<span className="min-w-0 flex-1">
											<span className="block break-words text-sm font-semibold text-foreground">
												{item.label}
											</span>
											<span className="mt-0.5 block text-xs text-muted">
												Review now
											</span>
										</span>
										<span
											className={`shrink-0 rounded-full px-2.5 py-1 text-sm font-bold ${
												isDanger
													? "bg-danger/10 text-danger"
													: item.count > 0
														? "bg-warning/10 text-warning"
														: "bg-default text-muted"
											}`}
										>
											{item.count.toLocaleString()}
										</span>
										<ChevronRight
											size={16}
											className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${
												isDanger ? "text-danger" : "text-warning"
											}`}
										/>
									</LinkAnchor>
								);
							})}
						</div>
					)}
				</div>

				{/* Quick Actions */}
				<div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
					<p className="text-sm font-medium text-muted">Quick Actions</p>
					<div className="grid grid-cols-1 gap-2.5">
						{QUICK_ACTIONS.map(({ label, icon: Icon, href }) => (
							<LinkAnchor
								key={href}
								to={href}
								className="group flex min-h-14 w-full min-w-0 items-center gap-3 rounded-xl border border-border bg-surface-tertiary/60 px-3.5 py-3 text-left shadow-sm ring-1 ring-transparent transition-all hover:border-accent/35 hover:bg-surface hover:ring-accent/15 no-underline"
							>
								<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent shadow-sm transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
									<Icon size={18} />
								</span>
								<span className="min-w-0 flex-1 break-words text-sm font-medium text-foreground">
									{label}
								</span>
								<ChevronRight
									size={16}
									className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
								/>
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
