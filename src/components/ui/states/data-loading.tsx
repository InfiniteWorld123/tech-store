import { Loader2 } from "lucide-react";

type DataLoadingProps = {
	label?: string;
	className?: string;
};

export function DataLoading({
	label = "Loading data...",
	className = "",
}: DataLoadingProps) {
	return (
		<div
			className={`flex flex-col items-center gap-3 py-16 text-center ${className}`}
		>
			<Loader2 size={28} className="animate-spin text-muted" />
			<p className="text-sm text-muted">{label}</p>
		</div>
	);
}
