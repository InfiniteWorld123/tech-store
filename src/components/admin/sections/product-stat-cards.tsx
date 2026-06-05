import { useQuery } from "@tanstack/react-query";
import { Card } from "@heroui/react";
import { AlertCircle, CheckCircle2, Package, TrendingDown } from "lucide-react";
import { getProductMetricsQueryOptions } from "#/queries/products.queries";

export function ProductStatCards() {
	const { data } = useQuery(getProductMetricsQueryOptions());
	const metrics = data?.data;

	const STAT_CARDS = [
		{
			label: "Total Products",
			value: metrics?.totalProducts,
			Icon: Package,
			colorClass: "text-accent",
			bgClass: "bg-accent/10",
		},
		{
			label: "Active",
			value: metrics?.activeProducts,
			Icon: CheckCircle2,
			colorClass: "text-success",
			bgClass: "bg-success/10",
		},
		{
			label: "Out of Stock",
			value: metrics?.outOfStockVariants,
			Icon: AlertCircle,
			colorClass: "text-danger",
			bgClass: "bg-danger/10",
		},
		{
			label: "Low Stock",
			value: metrics?.lowStockVariants,
			Icon: TrendingDown,
			colorClass: "text-warning",
			bgClass: "bg-warning/10",
		},
	];

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{STAT_CARDS.map((card) => (
				<Card key={card.label}>
					<Card.Content className="p-4 flex items-center gap-4">
						<div className={`p-2.5 rounded-xl ${card.bgClass}`}>
							<card.Icon size={20} className={card.colorClass} />
						</div>
						<div>
							<p className="text-2xl font-bold text-foreground">
								{metrics === undefined ? "—" : card.value}
							</p>
							<p className="text-xs text-muted mt-0.5">{card.label}</p>
						</div>
					</Card.Content>
				</Card>
			))}
		</div>
	);
}
