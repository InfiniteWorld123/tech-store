"use client";

import { Tabs } from "@heroui/react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DataError } from "#/components/ui/states/data-error";
import { DataLoading } from "#/components/ui/states/data-loading";
import {
	usePersistedViewMode,
	ViewModeToggle,
} from "#/components/ui/view-mode-toggle";
import { Route } from "#/routes/admin/options";
import {
	OPTION_CONFIGS,
	OPTION_TABS,
	type OptionRow,
	type OptionType,
} from "./option-configs";
import { DeleteOptionDialog } from "./sections/delete-option-dialog";
import { OptionFormModal } from "./sections/option-form-modal";
import {
	OptionsCards,
	OptionsList,
	OptionsTable,
} from "./sections/options-table";
import { OptionsToolbar } from "./sections/options-toolbar";
import { useOptionsPage } from "./use-options-page";

export function OptionsPage() {
	// All filter state lives in the URL so the browser back button works.
	const { tab, search, searchType } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const [createOpen, setCreateOpen] = useState(false);
	const [editTarget, setEditTarget] = useState<OptionRow | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<OptionRow | null>(null);
	const [viewMode, setViewMode] = usePersistedViewMode(
		"admin:options:view-mode",
	);

	const config = OPTION_CONFIGS[tab];

	const { rows, isLoading, isError } = useOptionsPage(
		tab,
		search ? { search, searchType } : undefined,
	);

	function handleTabChange(newTab: OptionType) {
		// Clear search when switching tabs so stale terms don't carry over.
		navigate({ search: { tab: newTab } });
	}

	function handleSearchChange(value: string) {
		// Remove the param entirely when empty — schema requires min(1).
		navigate({
			search: (prev) => ({ ...prev, search: value.trim() || undefined }),
		});
	}

	function handleSearchTypeChange(value: string) {
		navigate({
			search: (prev) => ({
				...prev,
				searchType: value as typeof searchType,
			}),
		});
	}

	return (
		<div className="space-y-4 py-6">
			<div>
				<h1 className="text-xl font-bold text-foreground">Options</h1>
				<p className="text-sm text-muted mt-0.5">{config.description}</p>
			</div>

			<Tabs.Root
				selectedKey={tab}
				onSelectionChange={(key) => handleTabChange(key as OptionType)}
			>
				<Tabs.List>
					{OPTION_TABS.map((t) => (
						<Tabs.Tab
							key={t}
							id={t}
							className="capitalize data-[selected]:bg-surface data-[selected]:shadow-sm rounded-lg"
						>
							{OPTION_CONFIGS[t].plural}
						</Tabs.Tab>
					))}
				</Tabs.List>

				{OPTION_TABS.map((t) => (
					<Tabs.Panel key={t} id={t} className="space-y-4 pt-4">
						<div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
							<div className="min-w-0 flex-1">
								<OptionsToolbar
									config={OPTION_CONFIGS[t]}
									search={t === tab ? (search ?? "") : ""}
									onSearchChange={handleSearchChange}
									searchType={searchType}
									onSearchTypeChange={handleSearchTypeChange}
									totalCount={t === tab ? rows.length : 0}
									onCreateClick={() => setCreateOpen(true)}
								/>
							</div>
							{t === tab ? (
								<ViewModeToggle value={viewMode} onChange={setViewMode} />
							) : null}
						</div>

						<div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
							{t === tab &&
								(isLoading ? (
									<DataLoading label={`Loading ${config.plural}...`} />
								) : isError ? (
									<DataError title={`Failed to load ${config.plural}`} />
								) : (
									<>
										{viewMode === "table" ? (
											<OptionsTable
												config={config}
												rows={rows}
												hasSearch={Boolean(search)}
												onEdit={setEditTarget}
												onDelete={setDeleteTarget}
											/>
										) : null}
										{viewMode === "list" ? (
											<OptionsList
												config={config}
												rows={rows}
												hasSearch={Boolean(search)}
												onEdit={setEditTarget}
												onDelete={setDeleteTarget}
											/>
										) : null}
										{viewMode === "cards" ? (
											<OptionsCards
												config={config}
												rows={rows}
												hasSearch={Boolean(search)}
												onEdit={setEditTarget}
												onDelete={setDeleteTarget}
											/>
										) : null}
									</>
								))}
						</div>
					</Tabs.Panel>
				))}
			</Tabs.Root>

			<OptionFormModal
				config={config}
				isOpen={createOpen}
				onClose={() => setCreateOpen(false)}
			/>
			<OptionFormModal
				config={config}
				isOpen={editTarget !== null}
				row={editTarget}
				onClose={() => setEditTarget(null)}
			/>

			<DeleteOptionDialog
				config={config}
				row={deleteTarget}
				onClose={() => setDeleteTarget(null)}
			/>
		</div>
	);
}
