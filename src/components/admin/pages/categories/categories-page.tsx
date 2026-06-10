"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCategoriesPage } from "#/hooks/use-categories-page";
import type { CategoryWithCount } from "#/server/catalog/categories/categories.types";
import { CategoriesTable } from "./sections/categories-table";
import { CategoriesToolbar } from "./sections/categories-toolbar";
import { CreateCategoryModal } from "./sections/create-category-modal";
import { DeleteCategoryDialog } from "./sections/delete-category-dialog";
import { EditCategoryModal } from "./sections/edit-category-modal";

export function CategoriesPage() {
	const [createOpen, setCreateOpen] = useState(false);
	const [editTarget, setEditTarget] = useState<CategoryWithCount | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<CategoryWithCount | null>(
		null,
	);

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

			{/* Toolbar */}
			<CategoriesToolbar
				search={inputValue}
				onSearchChange={setInputValue}
				totalCount={items.length}
				onCreateClick={() => setCreateOpen(true)}
			/>

			{/* Table card */}
			<div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
				{isLoading ? (
					<div className="py-16 flex flex-col items-center gap-3 text-center">
						<Loader2 size={28} className="text-muted animate-spin" />
						<p className="text-sm text-muted">Loading categories…</p>
					</div>
				) : isError ? (
					<div className="py-16 flex flex-col items-center gap-3 text-center">
						<AlertTriangle size={28} className="text-danger" />
						<div>
							<p className="text-sm font-medium text-foreground">
								Failed to load categories
							</p>
							<p className="text-xs text-muted mt-1">Please try again.</p>
						</div>
					</div>
				) : (
					<CategoriesTable
						categories={items}
						onEdit={setEditTarget}
						onDelete={setDeleteTarget}
					/>
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
