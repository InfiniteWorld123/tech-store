import { Button } from "@heroui/react";
import { useRouter } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

export function CategoriesError({ error }: { error: Error }) {
	const router = useRouter();

	return (
		<div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
			<AlertTriangle size={28} className="text-danger" />
			<div>
				<p className="text-sm font-medium text-foreground">
					Failed to load categories
				</p>
				<p className="text-xs text-muted mt-1">{error.message}</p>
			</div>
			<Button size="sm" variant="outline" onPress={() => router.invalidate()}>
				Try again
			</Button>
		</div>
	);
}
