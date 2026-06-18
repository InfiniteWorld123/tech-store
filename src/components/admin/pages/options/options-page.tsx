"use client";

import { Button, Tabs } from "@heroui/react";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import {
	AdminDetailSheet,
	DetailRow,
	DetailSection,
} from "#/components/admin/ui/admin-detail-sheet";
import { DataError } from "#/components/ui/states/data-error";
import { DataLoading } from "#/components/ui/states/data-loading";
import {
	usePersistedViewMode,
	ViewModeToggle,
} from "#/components/ui/view-mode-toggle";
import { useDebouncedSearchParam } from "#/hooks/use-debounced-search-param";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import {
	listColorsQueryOptions,
	listRamsQueryOptions,
	listScreensQueryOptions,
	listStoragesQueryOptions,
} from "#/queries/options.queries";
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

const getValidSearchType = (tab: OptionType, searchType: string) =>
	(OPTION_CONFIGS[tab].searchTypes as readonly string[]).includes(searchType)
		? searchType
		: "name";

const getOptionSearching = (
	tab: OptionType,
	search: string | undefined,
	searchType: string,
) =>
	search
		? {
				search,
				searchType: getValidSearchType(tab, searchType),
			}
		: undefined;

export function OptionsPage() {
	// All filter state lives in the URL so the browser back button works.
	const { tab, search, searchType } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { prefetch } = useQueryIntentPrefetch();

	const [createOpen, setCreateOpen] = useState(false);
	const [editTarget, setEditTarget] = useState<OptionRow | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<OptionRow | null>(null);
	const [detailTarget, setDetailTarget] = useState<OptionRow | null>(null);
	const [viewMode, setViewMode] = usePersistedViewMode(
		"admin:options:view-mode",
	);

	const config = OPTION_CONFIGS[tab];
	const commitSearch = useCallback(
		(value: string | undefined) => {
			navigate({
				search: (prev) => ({ ...prev, search: value }),
			});
		},
		[navigate],
	);
	const { inputValue: inputSearch, setInputValue: setInputSearch } =
		useDebouncedSearchParam({
			committedValue: search,
			onCommit: commitSearch,
		});

	const { rows, isLoading, isError } = useOptionsPage(
		tab,
		search ? { search, searchType } : undefined,
	);

	const prefetchOptionQuery = useCallback(
		(nextTab: OptionType, nextSearch = search, nextSearchType = searchType) => {
			const searching = getOptionSearching(nextTab, nextSearch, nextSearchType);

			switch (nextTab) {
				case "colors":
					prefetch(
						listColorsQueryOptions({
							searching:
								searching?.searchType === "hexCode"
									? {
											search: searching.search,
											searchType: searching.searchType,
										}
									: searching
										? { search: searching.search, searchType: "name" }
										: undefined,
						}),
					);
					return;
				case "storages":
					prefetch(
						listStoragesQueryOptions({
							searching:
								searching?.searchType === "valueGb"
									? {
											search: searching.search,
											searchType: searching.searchType,
										}
									: searching
										? { search: searching.search, searchType: "name" }
										: undefined,
						}),
					);
					return;
				case "rams":
					prefetch(
						listRamsQueryOptions({
							searching:
								searching?.searchType === "valueGb"
									? {
											search: searching.search,
											searchType: searching.searchType,
										}
									: searching
										? { search: searching.search, searchType: "name" }
										: undefined,
						}),
					);
					return;
				case "screens":
					prefetch(
						listScreensQueryOptions({
							searching:
								searching?.searchType === "valueInches"
									? {
											search: searching.search,
											searchType: searching.searchType,
										}
									: searching
										? { search: searching.search, searchType: "name" }
										: undefined,
						}),
					);
					return;
			}
		},
		[prefetch, search, searchType],
	);

	function handleTabChange(newTab: OptionType) {
		// Clear search when switching tabs so stale terms don't carry over.
		setDetailTarget(null);
		prefetchOptionQuery(newTab, undefined, "name");
		navigate({ search: { tab: newTab } });
	}

	function handleSearchChange(value: string) {
		setInputSearch(value);
	}

	function handleSearchTypeChange(value: string) {
		prefetchOptionQuery(tab, search, value);
		navigate({
			search: (prev) => ({
				...prev,
				searchType: value as typeof searchType,
			}),
		});
	}

	return (
		<div className="space-y-4 py-4 sm:py-6">
			<div>
				<h1 className="text-xl font-bold text-foreground">Options</h1>
				<p className="text-sm text-muted mt-0.5">{config.description}</p>
			</div>

			<Tabs.Root
				selectedKey={tab}
				onSelectionChange={(key) => handleTabChange(key as OptionType)}
			>
				<Tabs.List className="max-w-full overflow-x-auto">
					{OPTION_TABS.map((t) => (
						<Tabs.Tab
							key={t}
							id={t}
							onFocus={() => prefetchOptionQuery(t, undefined, "name")}
							onMouseEnter={() => prefetchOptionQuery(t, undefined, "name")}
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
									search={t === tab ? inputSearch : ""}
									onSearchChange={handleSearchChange}
									searchType={searchType}
									onSearchTypeChange={handleSearchTypeChange}
									onPrefetchSearchType={(value) =>
										prefetchOptionQuery(t, search, value)
									}
									totalCount={t === tab ? rows.length : 0}
									onCreateClick={() => setCreateOpen(true)}
								/>
							</div>
							{t === tab ? (
								<ViewModeToggle value={viewMode} onChange={setViewMode} />
							) : null}
						</div>

						<div className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
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
												onView={setDetailTarget}
												onEdit={setEditTarget}
												onDelete={setDeleteTarget}
											/>
										) : null}
										{viewMode === "list" ? (
											<OptionsList
												config={config}
												rows={rows}
												hasSearch={Boolean(search)}
												onView={setDetailTarget}
												onEdit={setEditTarget}
												onDelete={setDeleteTarget}
											/>
										) : null}
										{viewMode === "cards" ? (
											<OptionsCards
												config={config}
												rows={rows}
												hasSearch={Boolean(search)}
												onView={setDetailTarget}
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
			<OptionDetailSheet
				config={config}
				row={detailTarget}
				onClose={() => setDetailTarget(null)}
				onEdit={(row) => {
					setDetailTarget(null);
					setEditTarget(row);
				}}
				onDelete={(row) => {
					setDetailTarget(null);
					setDeleteTarget(row);
				}}
			/>
		</div>
	);
}

function OptionDetailSheet({
	config,
	row,
	onClose,
	onEdit,
	onDelete,
}: {
	config: (typeof OPTION_CONFIGS)[OptionType];
	row: OptionRow | null;
	onClose: () => void;
	onEdit: (row: OptionRow) => void;
	onDelete: (row: OptionRow) => void;
}) {
	return (
		<AdminDetailSheet
			isOpen={row !== null}
			onClose={onClose}
			title={row?.name ?? config.singular}
			subtitle={config.singular}
			footer={
				row ? (
					<>
						<Button size="sm" variant="outline" onPress={() => onEdit(row)}>
							Edit
						</Button>
						<Button size="sm" variant="danger" onPress={() => onDelete(row)}>
							Delete
						</Button>
					</>
				) : null
			}
		>
			{row ? (
				<div className="space-y-5">
					<DetailSection title="Option">
						<DetailRow label="ID" value={row.id} mono />
						<DetailRow label="Name" value={row.name} />
						<DetailRow label="Type" value={config.singular} />
						<DetailRow
							label={config.valueField.label}
							value={config.renderValue(row)}
						/>
					</DetailSection>
					<DetailSection title="Timestamps">
						<DetailRow
							label="Created"
							value={new Date(row.createdAt).toLocaleString()}
						/>
						<DetailRow
							label="Updated"
							value={new Date(row.updatedAt).toLocaleString()}
						/>
					</DetailSection>
				</div>
			) : null}
		</AdminDetailSheet>
	);
}
