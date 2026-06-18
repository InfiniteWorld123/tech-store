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
		<div className="min-w-0 space-y-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
			<p className="break-words text-sm font-medium text-muted">{title}</p>

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
						<div key={item.name} className="min-w-0 space-y-1">
							<div className="flex min-w-0 items-center justify-between gap-2">
								<span className="min-w-0 break-words text-xs font-medium capitalize text-foreground">
									{item.name.replace(/_/g, " ")}
								</span>
								<span className="shrink-0 text-xs font-semibold text-muted">
									{item.value}
								</span>
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
