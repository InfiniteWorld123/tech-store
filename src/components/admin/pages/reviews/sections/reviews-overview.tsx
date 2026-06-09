import { AnalyticsSection } from "#/components/admin/pages/analytics/sections/analytics-section";
import { HorizontalBarChart } from "#/components/admin/pages/analytics/sections/horizontal-bar-chart";
import { StatCard } from "#/components/admin/pages/analytics/sections/stat-card";
import { useGetReviewMetricsQueryOptions } from "#/hooks/analytics.hook";
import { useQuery } from "@tanstack/react-query";
import { BarChart2, Star } from "lucide-react";

export function ReviewsOverview() {
	const { data, isLoading, isError } = useQuery(useGetReviewMetricsQueryOptions());

	const statCards = [
		{ label: "Total Reviews", value: data?.data.totalReviews, icon: BarChart2, color: "accent" },
		{ label: "Avg Rating", value: data?.data.averageRating?.toFixed(1), icon: Star, color: "success" },
	] as const;

	const starDistributionData = [
		{ name: "5 stars", value: data?.data.byStar.five ?? 0 },
		{ name: "4 stars", value: data?.data.byStar.four ?? 0 },
		{ name: "3 stars", value: data?.data.byStar.three ?? 0 },
		{ name: "2 stars", value: data?.data.byStar.two ?? 0 },
		{ name: "1 star", value: data?.data.byStar.one ?? 0 },
	];

	return (
		<AnalyticsSection title="Reviews Overview" icon={Star}>
			<div className="grid grid-cols-2 gap-4">
				{statCards.map((card) => (
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

			<HorizontalBarChart
				title="Rating Distribution"
				data={starDistributionData}
				isLoading={isLoading}
				isError={isError}
				color="bg-warning"
			/>
		</AnalyticsSection>
	);
}
