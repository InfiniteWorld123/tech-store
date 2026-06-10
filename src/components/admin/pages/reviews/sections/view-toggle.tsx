import { LayoutGrid, List, Table } from "lucide-react";

export type ViewMode = "list" | "cards" | "table";

type ViewToggleProps = {
	value: ViewMode;
	onChange: (mode: ViewMode) => void;
};

const views = [
	{ mode: "list" as ViewMode, icon: List, label: "List" },
	{ mode: "cards" as ViewMode, icon: LayoutGrid, label: "Cards" },
	{ mode: "table" as ViewMode, icon: Table, label: "Table" },
];

export function ViewToggle({ value, onChange }: ViewToggleProps) {
	return (
		<div className="flex items-center gap-1 bg-default rounded-xl p-1">
			{views.map(({ mode, icon: Icon, label }) => (
				<button
					key={mode}
					type="button"
					onClick={() => onChange(mode)}
					title={label}
					className={`flex items-center justify-center size-8 rounded-lg transition-all ${
						value === mode
							? "bg-surface shadow-sm text-foreground"
							: "text-muted hover:text-foreground"
					}`}
				>
					<Icon size={15} />
				</button>
			))}
		</div>
	);
}
