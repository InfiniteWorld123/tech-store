import { Skeleton } from "@heroui/react";

type BarData = {
	name: string;
	value: number;
};

type HorizontalBarChartProps = {
	title: string;
	data: BarData[];
	isLoading: boolean;
	isError: boolean;
	color?: string;
};

export function HorizontalBarChart({
	title,
	data,
	isLoading,
	isError,
	color = "bg-accent",
}: HorizontalBarChartProps) {
	const max = Math.max(...data.map((d) => d.value), 1);

	return (
		<div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4">
			<p className="text-sm font-medium text-muted">{title}</p>

			{isError ? (
				<p className="text-sm text-danger">Failed to load</p>
			) : isLoading ? (
				<div className="space-y-3">
					{[1, 2, 3, 4, 5].map((i) => (
						<Skeleton key={i} className="h-5 w-full rounded-lg" />
					))}
				</div>
			) : (
				<div className="space-y-3">
					{data.map((item) => (
						<div key={item.name} className="space-y-1">
							<div className="flex items-center justify-between">
								<span className="text-xs capitalize text-foreground font-medium">
									{item.name.replace(/_/g, " ")}
								</span>
								<span className="text-xs font-semibold text-muted">{item.value}</span>
							</div>
							<div className="h-2 w-full rounded-full bg-default overflow-hidden">
								<div
									className={`h-full rounded-full ${color} transition-all duration-500`}
									style={{ width: `${(item.value / max) * 100}%` }}
								/>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
