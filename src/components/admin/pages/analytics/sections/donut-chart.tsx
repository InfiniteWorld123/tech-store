import { Skeleton } from "@heroui/react";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

type DonutData = {
	name: string;
	value: number;
};

type DonutChartProps = {
	title: string;
	data: DonutData[];
	isLoading: boolean;
	isError: boolean;
};

const COLORS = [
	"#6366f1",
	"#22c55e",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6",
	"#14b8a6",
];

export function DonutChart({
	title,
	data,
	isLoading,
	isError,
}: DonutChartProps) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="bg-surface border border-border rounded-2xl p-4 shadow-sm space-y-4">
			<p className="text-xs font-semibold uppercase tracking-widest text-muted">
				{title}
			</p>

			{isError ? (
				<p className="text-sm text-danger">Failed to load</p>
			) : isLoading || !mounted ? (
				<Skeleton className="h-48 w-full rounded-xl" />
			) : (
				<div className="flex items-center gap-6">
					<PieChart width={160} height={160}>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={45}
							outerRadius={70}
							paddingAngle={3}
							dataKey="value"
						>
							{data.map((entry, i) => (
								<Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							formatter={(value, name) => [value, name]}
							contentStyle={{
								borderRadius: "12px",
								border: "1px solid var(--border)",
								background: "var(--surface)",
								color: "var(--foreground)",
								fontSize: "12px",
							}}
						/>
					</PieChart>

					<ul className="flex flex-col gap-2 flex-1">
						{data.map((entry, i) => (
							<li
								key={entry.name}
								className="flex items-center justify-between gap-2"
							>
								<div className="flex items-center gap-2">
									<span
										className="size-2.5 rounded-full flex-shrink-0"
										style={{ background: COLORS[i % COLORS.length] }}
									/>
									<span className="text-xs text-muted capitalize">
										{entry.name.replace(/_/g, " ")}
									</span>
								</div>
								<span className="text-xs font-semibold text-foreground">
									{entry.value}
								</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
