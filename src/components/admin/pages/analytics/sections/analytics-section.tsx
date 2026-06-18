import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type AnalyticsSectionProps = {
	title: string;
	icon: LucideIcon;
	children: ReactNode;
};

export function AnalyticsSection({
	title,
	icon: Icon,
	children,
}: AnalyticsSectionProps) {
	return (
		<div className="min-w-0 space-y-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
			<div className="flex min-w-0 items-center gap-2 border-b border-border pb-1">
				<div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent/10">
					<Icon size={14} className="text-accent" />
				</div>
				<h2 className="min-w-0 break-words text-sm font-semibold text-foreground">
					{title}
				</h2>
			</div>
			{children}
		</div>
	);
}
