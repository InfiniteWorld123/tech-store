import { Button } from "@heroui/react";
import { Grid2X2, List, Table2 } from "lucide-react";
import { useEffect, useState } from "react";

export type ViewMode = "table" | "list" | "cards";

const VIEW_MODE_OPTIONS = [
	{ value: "table", label: "Table view", icon: Table2 },
	{ value: "list", label: "List view", icon: List },
	{ value: "cards", label: "Card view", icon: Grid2X2 },
] as const;

const isViewMode = (value: string | null): value is ViewMode =>
	value === "table" || value === "list" || value === "cards";

export function usePersistedViewMode(
	storageKey: string,
	defaultMode: ViewMode = "table",
) {
	const [viewMode, setViewModeState] = useState<ViewMode>(() => {
		if (typeof window === "undefined") return defaultMode;
		const stored = window.localStorage.getItem(storageKey);
		return isViewMode(stored) ? stored : defaultMode;
	});

	useEffect(() => {
		window.localStorage.setItem(storageKey, viewMode);
	}, [storageKey, viewMode]);

	return [viewMode, setViewModeState] as const;
}

type ViewModeToggleProps = {
	value: ViewMode;
	onChange: (value: ViewMode) => void;
	availableModes?: readonly ViewMode[];
};

export function ViewModeToggle({
	value,
	onChange,
	availableModes = ["table", "list", "cards"],
}: ViewModeToggleProps) {
	return (
		<div className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1">
			{VIEW_MODE_OPTIONS.filter((option) =>
				availableModes.includes(option.value),
			).map(({ value: optionValue, label, icon: Icon }) => (
				<Button
					key={optionValue}
					type="button"
					isIconOnly
					size="sm"
					variant={value === optionValue ? "secondary" : "ghost"}
					aria-label={label}
					onPress={() => onChange(optionValue)}
					className="size-8"
				>
					<Icon size={15} />
				</Button>
			))}
		</div>
	);
}
