import { Loader2 } from "lucide-react";

type PageLoadingProps = {
	title?: string;
	description?: string;
	className?: string;
};

export function PageLoading({
	title = "Loading page",
	description = "Please wait while the latest data is prepared.",
	className = "",
}: PageLoadingProps) {
	return (
		<div
			className={`flex min-h-64 flex-col items-center justify-center gap-3 px-6 py-16 text-center ${className}`}
		>
			<Loader2 size={28} className="animate-spin text-muted" />
			<div>
				<p className="text-sm font-medium text-foreground">{title}</p>
				<p className="mt-1 text-xs text-muted">{description}</p>
			</div>
		</div>
	);
}
