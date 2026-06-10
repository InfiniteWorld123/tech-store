import { useQuery } from "@tanstack/react-query";
import {
	Archive,
	BadgeDollarSign,
	Banknote,
	BarChart2,
	CircleX,
	Clock,
	CreditCard,
	DollarSign,
	Package,
	PackageX,
	RefreshCcw,
	ShoppingBag,
	ShoppingCart,
	Star,
	Tag,
	Timer,
	TrendingUp,
	Truck,
	Users,
	UserX,
	Zap,
} from "lucide-react";
import type { ComponentProps } from "react";
import {
	cartMetricsQueryOptions,
	customerMetricsQueryOptions,
	orderMetricsQueryOptions,
	paymentsMetricsQueryOptions,
	productMetricsQueryOptions,
	reviewMetricsQueryOptions,
	shippingMetricsQueryOptions,
} from "#/queries";
import { AnalyticsSection } from "./sections/analytics-section";
import { DonutChart } from "./sections/donut-chart";
import { HorizontalBarChart } from "./sections/horizontal-bar-chart";
import { StatCard } from "./sections/stat-card";

export function AnalyticsPage() {
	const {
		data: orderMetrics,
		isLoading: isLoadingOrders,
		isError: isErrorOrders,
	} = useQuery(orderMetricsQueryOptions());
	const {
		data: paymentMetrics,
		isLoading: isLoadingPayments,
		isError: isErrorPayments,
	} = useQuery(paymentsMetricsQueryOptions());
	const {
		data: shippingMetrics,
		isLoading: isLoadingShipping,
		isError: isErrorShipping,
	} = useQuery(shippingMetricsQueryOptions());
	const {
		data: productMetrics,
		isLoading: isLoadingProducts,
		isError: isErrorProducts,
	} = useQuery(productMetricsQueryOptions());
	const {
		data: reviewMetrics,
		isLoading: isLoadingReviews,
		isError: isErrorReviews,
	} = useQuery(reviewMetricsQueryOptions());
	const {
		data: customerMetrics,
		isLoading: isLoadingCustomers,
		isError: isErrorCustomers,
	} = useQuery(customerMetricsQueryOptions());
	const {
		data: cartMetrics,
		isLoading: isLoadingCarts,
		isError: isErrorCarts,
	} = useQuery(cartMetricsQueryOptions());

	// ── Orders ───────────────────────────────────────────────────────────────
	const orderStatCards = [
		{
			label: "Total Orders",
			value: orderMetrics?.data.overview.totalOrders,
			icon: ShoppingBag,
			color: "accent",
		},
		{
			label: "Total Revenue",
			value: orderMetrics?.data.overview.totalRevenue,
			icon: DollarSign,
			color: "success",
		},
		{
			label: "Avg Order Value",
			value: orderMetrics?.data.overview.averageOrderValue,
			icon: TrendingUp,
			color: "accent",
		},
		{
			label: "Active Orders",
			value: orderMetrics?.data.overview.activeOrders,
			icon: Package,
			color: "success",
		},
		{
			label: "Archived Orders",
			value: orderMetrics?.data.overview.archivedOrders,
			icon: Archive,
			color: "warning",
		},
	] as const;

	const ordersByStatusData = [
		{ name: "pending", value: orderMetrics?.data.byStatus.pending ?? 0 },
		{ name: "processing", value: orderMetrics?.data.byStatus.processing ?? 0 },
		{ name: "completed", value: orderMetrics?.data.byStatus.completed ?? 0 },
		{ name: "cancelled", value: orderMetrics?.data.byStatus.cancelled ?? 0 },
	];

	// ── Payments ─────────────────────────────────────────────────────────────
	const paymentStatCards = [
		{
			label: "Collected",
			value: paymentMetrics?.data.totalCollected,
			icon: BadgeDollarSign,
			color: "success",
		},
		{
			label: "Refunded",
			value: paymentMetrics?.data.totalRefunded,
			icon: RefreshCcw,
			color: "warning",
		},
		{
			label: "Pending",
			value: paymentMetrics?.data.totalPending,
			icon: Clock,
			color: "accent",
		},
		{
			label: "Failed",
			value: paymentMetrics?.data.totalFailed,
			icon: CircleX,
			color: "danger",
		},
		{
			label: "Total",
			value: paymentMetrics?.data.totalPayments,
			icon: CreditCard,
			color: "accent",
		},
		{
			label: "Avg Payment",
			value: paymentMetrics?.data.averagePaymentAmount,
			icon: Banknote,
			color: "success",
		},
	] as const;

	const paymentsByMethodData = [
		{ name: "card", value: paymentMetrics?.data.byMethod.card ?? 0 },
		{ name: "paypal", value: paymentMetrics?.data.byMethod.paypal ?? 0 },
		{
			name: "bank transfer",
			value: paymentMetrics?.data.byMethod.bank_transfer ?? 0,
		},
		{
			name: "cash on delivery",
			value: paymentMetrics?.data.byMethod.cash_on_delivery ?? 0,
		},
	];

	// ── Shipping ─────────────────────────────────────────────────────────────
	const shippingStatCards = [
		{
			label: "Total Shipments",
			value: shippingMetrics?.data.totalShipments,
			icon: Truck,
			color: "accent",
		},
		{
			label: "Avg Delivery (days)",
			value: shippingMetrics?.data.averageDeliveryTime?.toFixed(1),
			icon: Timer,
			color: "success",
		},
	] as const;

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

	const shippingByCarrierData = [
		{ name: "DHL", value: shippingMetrics?.data.byCarrier.dhl ?? 0 },
		{ name: "Hermes", value: shippingMetrics?.data.byCarrier.hermes ?? 0 },
		{ name: "UPS", value: shippingMetrics?.data.byCarrier.ups ?? 0 },
		{ name: "FedEx", value: shippingMetrics?.data.byCarrier.fedex ?? 0 },
	];

	const shippingByMethodData = [
		{ name: "standard", value: shippingMetrics?.data.byMethod.standard ?? 0 },
		{ name: "express", value: shippingMetrics?.data.byMethod.express ?? 0 },
		{ name: "same day", value: shippingMetrics?.data.byMethod.same_day ?? 0 },
	];

	// ── Products ─────────────────────────────────────────────────────────────
	const productStatCards = [
		{
			label: "Total Products",
			value: productMetrics?.data.totalProducts,
			icon: Package,
			color: "accent",
		},
		{
			label: "Active",
			value: productMetrics?.data.activeProducts,
			icon: Zap,
			color: "success",
		},
		{
			label: "Featured",
			value: productMetrics?.data.featuredProducts,
			icon: Star,
			color: "accent",
		},
		{
			label: "Bestsellers",
			value: productMetrics?.data.bestsellerProducts,
			icon: TrendingUp,
			color: "warning",
		},
	] as const;

	const productAlertCards = [
		{
			label: "Out of Stock",
			value: productMetrics?.data.outOfStockVariants,
			icon: PackageX,
			color: "danger",
		},
		{
			label: "Low Stock",
			value: productMetrics?.data.lowStockVariants,
			icon: Package,
			color: "warning",
		},
		{
			label: "With Discount",
			value: productMetrics?.data.productsWithDiscount,
			icon: Tag,
			color: "accent",
		},
	] as const;

	const productReviewStatCards = [
		{
			label: "Avg Rating",
			value: productMetrics?.data.averageProductRating?.toFixed(1),
			icon: Star,
			color: "success",
		},
		{
			label: "Total Reviews",
			value: productMetrics?.data.totalReviewsAcrossProducts,
			icon: BarChart2,
			color: "accent",
		},
		{
			label: "No Reviews",
			value: productMetrics?.data.productsWithNoReviews,
			icon: UserX,
			color: "warning",
		},
		{
			label: "Total Variants",
			value: productMetrics?.data.totalVariants,
			icon: Package,
			color: "accent",
		},
	] as const;

	// ── Reviews ───────────────────────────────────────────────────────────────
	const reviewStatCards = [
		{
			label: "Total Reviews",
			value: reviewMetrics?.data.totalReviews,
			icon: BarChart2,
			color: "accent",
		},
		{
			label: "Avg Rating",
			value: reviewMetrics?.data.averageRating?.toFixed(1),
			icon: Star,
			color: "success",
		},
	] as const;

	const starDistributionData = [
		{ name: "5 stars", value: reviewMetrics?.data.byStar.five ?? 0 },
		{ name: "4 stars", value: reviewMetrics?.data.byStar.four ?? 0 },
		{ name: "3 stars", value: reviewMetrics?.data.byStar.three ?? 0 },
		{ name: "2 stars", value: reviewMetrics?.data.byStar.two ?? 0 },
		{ name: "1 star", value: reviewMetrics?.data.byStar.one ?? 0 },
	];

	// ── Customers ─────────────────────────────────────────────────────────────
	const customerStatCards = [
		{
			label: "Total Customers",
			value: customerMetrics?.data.totalCustomers,
			icon: Users,
			color: "accent",
		},
		{
			label: "Verified",
			value: customerMetrics?.data.verifiedCustomers,
			icon: Zap,
			color: "success",
		},
		{
			label: "With Orders",
			value: customerMetrics?.data.customersWithOrders,
			icon: ShoppingBag,
			color: "accent",
		},
		{
			label: "Without Orders",
			value: customerMetrics?.data.customersWithoutOrders,
			icon: UserX,
			color: "warning",
		},
	] as const;

	const customerDonutData = [
		{ name: "verified", value: customerMetrics?.data.verifiedCustomers ?? 0 },
		{
			name: "unverified",
			value: customerMetrics?.data.unverifiedCustomers ?? 0,
		},
	];

	// ── Carts ─────────────────────────────────────────────────────────────────
	const cartStatCards = [
		{
			label: "Total Carts",
			value: cartMetrics?.data.totalCarts,
			icon: ShoppingCart,
			color: "accent",
		},
		{
			label: "Active Carts",
			value: cartMetrics?.data.activeCarts,
			icon: Zap,
			color: "success",
		},
		{
			label: "Avg Cart Value",
			value: cartMetrics?.data.averageCartValue,
			icon: DollarSign,
			color: "accent",
		},
		{
			label: "Avg Items / Cart",
			value: cartMetrics?.data.averageItemsPerCart?.toFixed(1),
			icon: Package,
			color: "accent",
		},
	] as const;

	const cartDonutData = [
		{ name: "user carts", value: cartMetrics?.data.userCarts ?? 0 },
		{ name: "guest carts", value: cartMetrics?.data.guestCarts ?? 0 },
	];

	// ── Render ────────────────────────────────────────────────────────────────
	const renderStatCards = (
		cards: readonly {
			label: string;
			value: string | number | undefined;
			icon: ComponentProps<typeof StatCard>["icon"];
			color: ComponentProps<typeof StatCard>["color"];
		}[],
		isLoading: boolean,
		isError: boolean,
		cols: string,
	) => (
		<div className={`grid ${cols} gap-4`}>
			{cards.map((card) => (
				<StatCard
					key={card.label}
					label={card.label}
					icon={card.icon}
					color={card.color}
					isLoading={isLoading}
					isError={isError}
				>
					<p className="text-2xl font-bold text-foreground">{card.value}</p>
				</StatCard>
			))}
		</div>
	);

	return (
		<div className="py-6 space-y-6">
			{/* ── Orders ── */}
			<AnalyticsSection title="Orders" icon={ShoppingBag}>
				{renderStatCards(
					orderStatCards,
					isLoadingOrders,
					isErrorOrders,
					"grid-cols-2 sm:grid-cols-3",
				)}
				<DonutChart
					title="Orders by Status"
					data={ordersByStatusData}
					isLoading={isLoadingOrders}
					isError={isErrorOrders}
				/>
			</AnalyticsSection>

			{/* ── Payments ── */}
			<AnalyticsSection title="Payments" icon={CreditCard}>
				{renderStatCards(
					paymentStatCards,
					isLoadingPayments,
					isErrorPayments,
					"grid-cols-2 sm:grid-cols-3",
				)}
				<DonutChart
					title="Payments by Method"
					data={paymentsByMethodData}
					isLoading={isLoadingPayments}
					isError={isErrorPayments}
				/>
			</AnalyticsSection>

			{/* ── Shipping ── */}
			<AnalyticsSection title="Shipping" icon={Truck}>
				{renderStatCards(
					shippingStatCards,
					isLoadingShipping,
					isErrorShipping,
					"grid-cols-2 sm:grid-cols-2",
				)}
				<HorizontalBarChart
					title="Fulfillment Pipeline"
					data={shippingPipelineData}
					isLoading={isLoadingShipping}
					isError={isErrorShipping}
					color="bg-accent"
				/>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<HorizontalBarChart
						title="By Carrier"
						data={shippingByCarrierData}
						isLoading={isLoadingShipping}
						isError={isErrorShipping}
						color="bg-success"
					/>
					<HorizontalBarChart
						title="By Method"
						data={shippingByMethodData}
						isLoading={isLoadingShipping}
						isError={isErrorShipping}
						color="bg-warning"
					/>
				</div>
			</AnalyticsSection>

			{/* ── Products ── */}
			<AnalyticsSection title="Products" icon={Package}>
				{renderStatCards(
					productStatCards,
					isLoadingProducts,
					isErrorProducts,
					"grid-cols-2 sm:grid-cols-4",
				)}
				{renderStatCards(
					productAlertCards,
					isLoadingProducts,
					isErrorProducts,
					"grid-cols-2 sm:grid-cols-3",
				)}
				{renderStatCards(
					productReviewStatCards,
					isLoadingProducts,
					isErrorProducts,
					"grid-cols-2 sm:grid-cols-4",
				)}
			</AnalyticsSection>

			{/* ── Reviews ── */}
			<AnalyticsSection title="Reviews" icon={Star}>
				{renderStatCards(
					reviewStatCards,
					isLoadingReviews,
					isErrorReviews,
					"grid-cols-2 sm:grid-cols-2",
				)}
				<HorizontalBarChart
					title="Rating Distribution"
					data={starDistributionData}
					isLoading={isLoadingReviews}
					isError={isErrorReviews}
					color="bg-warning"
				/>
			</AnalyticsSection>

			{/* ── Customers & Carts ── */}
			<AnalyticsSection title="Customers & Carts" icon={Users}>
				{renderStatCards(
					customerStatCards,
					isLoadingCustomers,
					isErrorCustomers,
					"grid-cols-2 sm:grid-cols-4",
				)}
				{renderStatCards(
					cartStatCards,
					isLoadingCarts,
					isErrorCarts,
					"grid-cols-2 sm:grid-cols-4",
				)}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<DonutChart
						title="Customer Verification"
						data={customerDonutData}
						isLoading={isLoadingCustomers}
						isError={isErrorCustomers}
					/>
					<DonutChart
						title="Cart Type"
						data={cartDonutData}
						isLoading={isLoadingCarts}
						isError={isErrorCarts}
					/>
				</div>
			</AnalyticsSection>
		</div>
	);
}
