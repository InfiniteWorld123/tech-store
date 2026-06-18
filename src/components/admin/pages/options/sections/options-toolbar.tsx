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
	onPrefetchSearchType: (value: string) => void;
	totalCount: number;
	onCreateClick: () => void;
};

export function OptionsToolbar({
	config,
	search,
	onSearchChange,
	searchType,
	onSearchTypeChange,
	onPrefetchSearchType,
	totalCount,
	onCreateClick,
}: Props) {
	const searchTypeOptions = config.searchTypes.map((key) => ({
		key,
		label: key === "name" ? "Name" : config.valueField.label,
	}));
	const warmSearchTypes = () => {
		for (const { key } of searchTypeOptions) {
			onPrefetchSearchType(key);
		}
	};

	return (
		<div className="grid w-full min-w-0 grid-cols-1 gap-3 min-[520px]:grid-cols-[minmax(0,1fr)_auto] min-[520px]:items-center">
			{/* Left: search type + search + count */}
			<div className="grid min-w-0 grid-cols-1 gap-2 min-[420px]:grid-cols-[auto_minmax(0,1fr)] min-[420px]:items-center">
				<Select.Root
					selectedKey={searchType}
					onSelectionChange={(key) => onSearchTypeChange(key as string)}
					aria-label="Search by"
				>
					<Select.Trigger
						onFocus={warmSearchTypes}
						onMouseEnter={warmSearchTypes}
						className="flex h-9 min-w-0 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-sm outline-none transition-colors hover:bg-default/50 focus-visible:ring-2 focus-visible:ring-primary/50"
					>
						<Select.Value className="min-w-0 truncate text-foreground" />
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
									onFocus={() => onPrefetchSearchType(key)}
									onMouseEnter={() => onPrefetchSearchType(key)}
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
					className="min-w-0 min-[420px]:min-w-0"
				>
					<SearchField.Group>
						<SearchField.SearchIcon />
						<SearchField.Input placeholder={`Search ${config.plural}...`} />
						<SearchField.ClearButton />
					</SearchField.Group>
				</SearchField.Root>

				<Chip
					size="sm"
					variant="soft"
					color="default"
					className="justify-self-start min-[420px]:col-span-2"
				>
					{totalCount} {totalCount === 1 ? config.singular : config.plural}
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
				New {config.singular}
			</Button>
		</div>
	);
}
