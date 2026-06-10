import { Skeleton } from "@heroui/react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Color = "accent" | "success" | "warning" | "danger";

const colorMap: Record<Color, { bg: string; icon: string }> = {
	accent: { bg: "bg-accent", icon: "text-white" },
	success: { bg: "bg-success", icon: "text-white" },
	warning: { bg: "bg-warning", icon: "text-white" },
	danger: { bg: "bg-danger", icon: "text-white" },
};

type StatCardProps = {
	label: string;
	icon: LucideIcon;
	isLoading: boolean;
	isError: boolean;
	color?: Color;
	children: ReactNode;
	errorComponent?: ReactNode;
};

export function StatCard({
	label,
	icon: Icon,
	isLoading,
	isError,
	color = "accent",
	children,
	errorComponent,
}: StatCardProps) {
	const c = colorMap[color];

	return (
		<div className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
			{/* Label */}
			<p className="text-sm font-medium text-muted">{label}</p>

			{/* Icon + Value row */}
			<div className="flex items-end justify-between">
				<div
					className={`flex size-12 items-center justify-center rounded-2xl ${c.bg}`}
				>
					<Icon size={22} className={c.icon} />
				</div>

				{isError ? (
					(errorComponent ?? (
						<p className="text-sm text-danger">Failed to load</p>
					))
				) : isLoading ? (
					<Skeleton className="h-9 w-24 rounded-lg" />
				) : (
					<div className="text-right">{children}</div>
				)}
			</div>
		</div>
	);
}
