"use client";

import { useState } from "react";
import { DataError } from "#/components/ui/states/data-error";
import { DataLoading } from "#/components/ui/states/data-loading";
import {
	usePersistedViewMode,
	ViewModeToggle,
} from "#/components/ui/view-mode-toggle";
import type { CategoryItem } from "./categories.types";
import {
	CategoriesCards,
	CategoriesList,
	CategoriesTable,
} from "./sections/categories-table";
import { CategoriesToolbar } from "./sections/categories-toolbar";
import { CreateCategoryModal } from "./sections/create-category-modal";
import { DeleteCategoryDialog } from "./sections/delete-category-dialog";
import { EditCategoryModal } from "./sections/edit-category-modal";
import { useCategoriesPage } from "./use-categories-page";

export function CategoriesPage() {
	const [viewMode, setViewMode] = usePersistedViewMode(
		"admin:categories:view-mode",
	);
	const [createOpen, setCreateOpen] = useState(false);
	const [editTarget, setEditTarget] = useState<CategoryItem | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);

	const { inputValue, setInputValue, items, isLoading, isError } =
		useCategoriesPage();

	return (
		<div className="space-y-4 py-6">
			{/* Page title */}
			<div>
				<h1 className="text-xl font-bold text-foreground">Categories</h1>
				<p className="text-sm text-muted mt-0.5">
					Manage your product categories.
				</p>
			</div>

			<div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
				<div className="min-w-0 flex-1">
					<CategoriesToolbar
						search={inputValue}
						onSearchChange={setInputValue}
						totalCount={items.length}
						onCreateClick={() => setCreateOpen(true)}
					/>
				</div>
				<ViewModeToggle value={viewMode} onChange={setViewMode} />
			</div>

			<div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
				{isLoading ? (
					<DataLoading label="Loading categories..." />
				) : isError ? (
					<DataError title="Failed to load categories" />
				) : (
					<>
						{viewMode === "table" ? (
							<CategoriesTable
								categories={items}
								onEdit={setEditTarget}
								onDelete={setDeleteTarget}
							/>
						) : null}
						{viewMode === "list" ? (
							<CategoriesList
								categories={items}
								onEdit={setEditTarget}
								onDelete={setDeleteTarget}
							/>
						) : null}
						{viewMode === "cards" ? (
							<CategoriesCards
								categories={items}
								onEdit={setEditTarget}
								onDelete={setDeleteTarget}
							/>
						) : null}
					</>
				)}
			</div>

			{/* Modals */}
			<CreateCategoryModal
				isOpen={createOpen}
				onClose={() => setCreateOpen(false)}
			/>
			<EditCategoryModal
				category={editTarget}
				onClose={() => setEditTarget(null)}
			/>
			<DeleteCategoryDialog
				category={deleteTarget}
				onClose={() => setDeleteTarget(null)}
			/>
		</div>
	);
}
