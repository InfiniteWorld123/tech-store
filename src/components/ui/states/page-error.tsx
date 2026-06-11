import { Button } from "@heroui/react";
import { useRouter } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

type PageErrorProps = {
	error?: Error;
	title?: string;
	description?: string;
	className?: string;
};

export function PageError({
	error,
	title = "Something went wrong",
	description = "Refresh the page or try again in a moment.",
	className = "",
}: PageErrorProps) {
	const router = useRouter();
	const message = error?.message || description;

	return (
		<div
			className={`flex min-h-64 flex-col items-center justify-center gap-3 px-6 py-16 text-center ${className}`}
		>
			<AlertTriangle size={28} className="text-danger" />
			<div>
				<p className="text-sm font-medium text-foreground">{title}</p>
				<p className="mt-1 max-w-md text-xs text-muted">{message}</p>
			</div>
			<Button size="sm" variant="outline" onPress={() => router.invalidate()}>
				Try again
			</Button>
		</div>
	);
}
