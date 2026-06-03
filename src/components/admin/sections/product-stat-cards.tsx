import { Card } from "@heroui/react";
import { AlertCircle, CheckCircle2, Package, TrendingDown } from "lucide-react";
import type { GetProductMetricsOutputType } from "#/server/analytics/analytics.types";

const MOCK_METRICS: GetProductMetricsOutputType = {
	totalProducts: 124,
	activeProducts: 98,
	inactiveProducts: 26,
	featuredProducts: 12,
	bestsellerProducts: 8,
	totalVariants: 347,
	outOfStockVariants: 15,
	lowStockVariants: 23,
	averageProductRating: 4.2,
	totalReviewsAcrossProducts: 1843,
	productsWithNoReviews: 34,
	productsWithDiscount: 42,
};

const STAT_CARDS = [
	{
		label: "Total Products",
		value: MOCK_METRICS.totalProducts,
		Icon: Package,
		colorClass: "text-accent",
		bgClass: "bg-accent/10",
	},
	{
		label: "Active",
		value: MOCK_METRICS.activeProducts,
		Icon: CheckCircle2,
		colorClass: "text-success",
		bgClass: "bg-success/10",
	},
	{
		label: "Out of Stock",
		value: MOCK_METRICS.outOfStockVariants,
		Icon: AlertCircle,
		colorClass: "text-danger",
		bgClass: "bg-danger/10",
	},
	{
		label: "Low Stock",
		value: MOCK_METRICS.lowStockVariants,
		Icon: TrendingDown,
		colorClass: "text-warning",
		bgClass: "bg-warning/10",
	},
];

export function ProductStatCards() {
	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{STAT_CARDS.map((card) => (
				<Card key={card.label}>
					<Card.Content className="p-4 flex items-center gap-4">
						<div className={`p-2.5 rounded-xl ${card.bgClass}`}>
							<card.Icon size={20} className={card.colorClass} />
						</div>
						<div>
							<p className="text-2xl font-bold text-foreground">{card.value}</p>
							<p className="text-xs text-muted mt-0.5">{card.label}</p>
						</div>
					</Card.Content>
				</Card>
			))}
		</div>
	);
}
