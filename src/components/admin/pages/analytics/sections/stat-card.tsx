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
		<div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
			{/* Label */}
			<p className="break-words text-sm font-medium text-muted">{label}</p>

			{/* Icon + Value row */}
			<div className="flex min-w-0 flex-col gap-3 min-[360px]:flex-row min-[360px]:items-end min-[360px]:justify-between">
				<div
					className={`flex size-11 shrink-0 items-center justify-center rounded-2xl sm:size-12 ${c.bg}`}
				>
					<Icon size={22} className={c.icon} />
				</div>

				{isError ? (
					(errorComponent ?? (
						<p className="break-words text-sm text-danger">Failed to load</p>
					))
				) : isLoading ? (
					<Skeleton className="h-9 w-24 rounded-lg" />
				) : (
					<div className="min-w-0 break-words text-left min-[360px]:text-right">
						{children}
					</div>
				)}
			</div>
		</div>
	);
}
