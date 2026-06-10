import { Button, Chip } from "@heroui/react";
import { Plus, Search } from "lucide-react";

type Props = {
	search: string;
	onSearchChange: (value: string) => void;
	totalCount: number;
	onCreateClick: () => void;
};

export function CategoriesToolbar({
	search,
	onSearchChange,
	totalCount,
	onCreateClick,
}: Props) {
	return (
		<div className="flex items-center justify-between gap-3 flex-wrap">
			{/* Left: search + count */}
			<div className="flex items-center gap-3">
				<div className="relative">
					<Search
						size={15}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
					/>
					<input
						type="text"
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder="Search categories..."
						className="w-64 pl-9 pr-3 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
					/>
				</div>
				<Chip size="sm" variant="flat" color="default">
					{totalCount} {totalCount === 1 ? "category" : "categories"}
				</Chip>
			</div>

			{/* Right: create button */}
			<Button
				size="sm"
				variant="primary"
				onPress={onCreateClick}
				className="gap-1.5"
			>
				<Plus size={15} />
				New Category
			</Button>
		</div>
	);
}
