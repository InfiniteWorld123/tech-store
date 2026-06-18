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
		<div className="grid w-full min-w-0 grid-cols-1 gap-3 min-[520px]:grid-cols-[minmax(0,1fr)_auto] min-[520px]:items-center">
			{/* Left: search + count */}
			<div className="grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-[minmax(0,1fr)_auto] min-[420px]:items-center">
				<div className="relative min-w-0">
					<Search
						size={15}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
					/>
					<input
						type="text"
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder="Search categories..."
						className="w-full min-w-0 rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
					/>
				</div>
				<Chip
					size="sm"
					variant="soft"
					color="default"
					className="justify-self-start"
				>
					{totalCount} {totalCount === 1 ? "category" : "categories"}
				</Chip>
			</div>

			{/* Right: create button */}
			<Button
				size="sm"
				variant="primary"
				onPress={onCreateClick}
				className="w-full justify-center gap-1.5 min-[520px]:w-auto"
			>
				<Plus size={15} />
				New Category
			</Button>
		</div>
	);
}
