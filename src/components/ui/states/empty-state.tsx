import type { LucideIcon } from "lucide-react";
import { PackageOpen } from "lucide-react";

type EmptyStateProps = {
	icon?: LucideIcon;
	title: string;
	description?: string;
	className?: string;
};

export function EmptyState({
	icon: Icon = PackageOpen,
	title,
	description,
	className = "",
}: EmptyStateProps) {
	return (
		<div
			className={`flex flex-col items-center gap-3 py-16 text-center ${className}`}
		>
			<Icon size={28} className="text-muted" />
			<div>
				<p className="text-sm font-medium text-foreground">{title}</p>
				{description ? (
					<p className="mt-1 text-xs text-muted">{description}</p>
				) : null}
			</div>
		</div>
	);
}
