import { CATEGORY_ICON_NAMES, DynamicIcon } from "./category-icon";

type Props = {
	value: string | null;
	onChange: (name: string | null) => void;
};

// Grid of curated lucide icons. Clicking selects an icon (storing its exact
// PascalCase name); clicking the selected icon again clears it.
export function CategoryIconPicker({ value, onChange }: Props) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-sm font-medium text-foreground">Icon</span>
			<div className="grid grid-cols-8 gap-2">
				{CATEGORY_ICON_NAMES.map((name) => {
					const isSelected = value === name;
					return (
						<button
							key={name}
							type="button"
							title={name}
							aria-pressed={isSelected}
							onClick={() => onChange(isSelected ? null : name)}
							className={`flex items-center justify-center aspect-square rounded-xl border transition-colors ${
								isSelected
									? "border-accent bg-accent/10 text-accent"
									: "border-border bg-surface text-muted hover:text-foreground hover:border-accent/40"
							}`}
						>
							<DynamicIcon name={name} size={18} />
						</button>
					);
				})}
			</div>
		</div>
	);
}
