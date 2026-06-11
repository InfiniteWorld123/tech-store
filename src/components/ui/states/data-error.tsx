import { AlertTriangle } from "lucide-react";

type DataErrorProps = {
	title?: string;
	description?: string;
	className?: string;
};

export function DataError({
	title = "Failed to load data",
	description = "Please try again.",
	className = "",
}: DataErrorProps) {
	return (
		<div
			className={`flex flex-col items-center gap-3 py-16 text-center ${className}`}
		>
			<AlertTriangle size={28} className="text-danger" />
			<div>
				<p className="text-sm font-medium text-foreground">{title}</p>
				<p className="mt-1 text-xs text-muted">{description}</p>
			</div>
		</div>
	);
}
