"use client";

import { Button, Chip } from "@heroui/react";
import { useState } from "react";
import {
	AdminDetailSheet,
	DetailRow,
	DetailSection,
} from "#/components/admin/ui/admin-detail-sheet";
import { CategoryIconDisplay } from "#/components/ui/icons/category-icon";
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
	const [detailTarget, setDetailTarget] = useState<CategoryItem | null>(null);

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
								onView={setDetailTarget}
								onEdit={setEditTarget}
								onDelete={setDeleteTarget}
							/>
						) : null}
						{viewMode === "list" ? (
							<CategoriesList
								categories={items}
								onView={setDetailTarget}
								onEdit={setEditTarget}
								onDelete={setDeleteTarget}
							/>
						) : null}
						{viewMode === "cards" ? (
							<CategoriesCards
								categories={items}
								onView={setDetailTarget}
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
			<CategoryDetailSheet
				category={detailTarget}
				onClose={() => setDetailTarget(null)}
				onEdit={(category) => {
					setDetailTarget(null);
					setEditTarget(category);
				}}
				onDelete={(category) => {
					setDetailTarget(null);
					setDeleteTarget(category);
				}}
			/>
		</div>
	);
}

function CategoryDetailSheet({
	category,
	onClose,
	onEdit,
	onDelete,
}: {
	category: CategoryItem | null;
	onClose: () => void;
	onEdit: (category: CategoryItem) => void;
	onDelete: (category: CategoryItem) => void;
}) {
	return (
		<AdminDetailSheet
			isOpen={category !== null}
			onClose={onClose}
			title={category?.name ?? "Category"}
			subtitle={category?.slug}
			badge={
				category ? (
					<Chip size="sm" variant="soft" color="default">
						{category.totalProducts} products
					</Chip>
				) : null
			}
			footer={
				category ? (
					<>
						<Button
							size="sm"
							variant="outline"
							onPress={() => onEdit(category)}
						>
							Edit
						</Button>
						<Button
							size="sm"
							variant="danger"
							onPress={() => onDelete(category)}
						>
							Delete
						</Button>
					</>
				) : null
			}
		>
			{category ? (
				<div className="space-y-5">
					<div className="flex items-center gap-3 rounded-2xl border border-border bg-default/30 p-4">
						<CategoryIconDisplay
							icon={category.icon}
							iconColor={category.iconColor}
							iconBg={category.iconBg}
							name={category.name}
						/>
						<div>
							<p className="text-sm font-semibold text-foreground">
								{category.name}
							</p>
							<p className="font-mono text-xs text-muted">{category.slug}</p>
						</div>
					</div>
					<DetailSection title="Category">
						<DetailRow label="ID" value={category.id} mono />
						<DetailRow label="Name" value={category.name} />
						<DetailRow label="Slug" value={category.slug} mono />
						<DetailRow label="Products" value={category.totalProducts} />
					</DetailSection>
					<DetailSection title="Icon">
						<DetailRow label="Icon" value={category.icon ?? "Default"} />
						<DetailRow
							label="Icon color"
							value={category.iconColor ?? "Default"}
							mono
						/>
						<DetailRow
							label="Icon background"
							value={category.iconBg ?? "Default"}
							mono
						/>
					</DetailSection>
					<DetailSection title="Timestamps">
						<DetailRow
							label="Created"
							value={new Date(category.createdAt).toLocaleString()}
						/>
						<DetailRow
							label="Updated"
							value={new Date(category.updatedAt).toLocaleString()}
						/>
					</DetailSection>
				</div>
			) : null}
		</AdminDetailSheet>
	);
}
