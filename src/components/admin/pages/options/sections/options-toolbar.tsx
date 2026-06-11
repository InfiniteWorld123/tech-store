"use client";
import { Button, Chip, ListBox, SearchField, Select } from "@heroui/react";
import { ChevronDown, Plus } from "lucide-react";
import type { OptionConfig } from "../option-configs";

type Props = {
	config: OptionConfig;
	search: string;
	onSearchChange: (value: string) => void;
	searchType: string;
	onSearchTypeChange: (value: string) => void;
	totalCount: number;
	onCreateClick: () => void;
};

export function OptionsToolbar({
	config,
	search,
	onSearchChange,
	searchType,
	onSearchTypeChange,
	totalCount,
	onCreateClick,
}: Props) {
	const searchTypeOptions = config.searchTypes.map((key) => ({
		key,
		label: key === "name" ? "Name" : config.valueField.label,
	}));

	return (
		<div className="flex items-center justify-between gap-3 flex-wrap">
			{/* Left: search type + search + count */}
			<div className="flex items-center gap-2">
				<Select.Root
					selectedKey={searchType}
					onSelectionChange={(key) => onSearchTypeChange(key as string)}
					aria-label="Search by"
				>
					<Select.Trigger className="flex items-center gap-1.5 h-9 px-3 text-sm rounded-xl border border-border bg-surface hover:bg-default/50 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50 min-w-24">
						<Select.Value className="text-foreground" />
						<Select.Indicator>
							<ChevronDown size={13} className="text-muted" />
						</Select.Indicator>
					</Select.Trigger>
					<Select.Popover>
						<ListBox.Root className="p-1 min-w-28 outline-none">
							{searchTypeOptions.map(({ key, label }) => (
								<ListBox.Item
									key={key}
									id={key}
									className="flex items-center px-2.5 py-1.5 text-sm rounded-lg cursor-pointer outline-none data-[focused]:bg-default/60 data-[selected]:font-medium data-[selected]:text-primary"
								>
									{label}
								</ListBox.Item>
							))}
						</ListBox.Root>
					</Select.Popover>
				</Select.Root>

				<SearchField.Root
					aria-label={`Search ${config.plural}`}
					value={search}
					onChange={onSearchChange}
					className="w-56"
				>
					<SearchField.Group>
						<SearchField.SearchIcon />
						<SearchField.Input placeholder={`Search ${config.plural}...`} />
						<SearchField.ClearButton />
					</SearchField.Group>
				</SearchField.Root>

				<Chip size="sm" variant="soft" color="default">
					{totalCount} {totalCount === 1 ? config.singular : config.plural}
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
				New {config.singular}
			</Button>
		</div>
	);
}
