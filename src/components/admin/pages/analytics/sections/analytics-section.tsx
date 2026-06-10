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
		<div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4">
			<div className="flex items-center gap-2 pb-1 border-b border-border">
				<div className="flex size-7 items-center justify-center rounded-lg bg-accent/10">
					<Icon size={14} className="text-accent" />
				</div>
				<h2 className="text-sm font-semibold text-foreground">{title}</h2>
			</div>
			{children}
		</div>
	);
}
