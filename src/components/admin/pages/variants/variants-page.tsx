"use client";

import { AlertDialog, Button, Chip, Form, Modal } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import {
	Boxes,
	CheckCircle2,
	ImageIcon,
	type LucideIcon,
	Pencil,
	Plus,
	Search,
	Trash2,
	X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
	AdminDetailSheet,
	DetailRow,
	DetailSection,
} from "#/components/admin/ui/admin-detail-sheet";
import { getAdminFieldError } from "#/components/admin/ui/admin-form-errors";
import { AdminImageUploader } from "#/components/admin/ui/admin-image-uploader";
import { InputField } from "#/components/ui/fields/input-field";
import { WindowedPagination } from "#/components/ui/pagination/windowed-pagination";
import {
	usePersistedViewMode,
	ViewModeToggle,
} from "#/components/ui/view-mode-toggle";
import { useCreateVariant } from "#/mutations/variants/use-create-variant";
import { useDeleteVariant } from "#/mutations/variants/use-delete-variant";
import { useUpdateVariant } from "#/mutations/variants/use-update-variant";
import {
	listColorsQueryOptions,
	listRamsQueryOptions,
	listScreensQueryOptions,
	listStoragesQueryOptions,
} from "#/queries/options.queries";
import type { Color } from "#/server/catalog/options/colors/colors.types";
import type { Ram } from "#/server/catalog/options/rams/rams.types";
import type { Screen } from "#/server/catalog/options/screens/screens.types";
import type { Storage } from "#/server/catalog/options/storages/storages.types";
import type { AdminProductDetailsType } from "#/server/catalog/products/products.types";
import {
	type AdminProductListItemType,
	type AdminVariantType,
	type StockFilter,
	useVariantsPage,
} from "./use-variants-page";

type VariantFormValues = {
	productId: string;
	sku: string;
	price: string;
	compareAtPrice: string;
	stockQuantity: string;
	colorId: string;
	storageId: string;
	ramId: string;
	screenSizeId: string;
	isDefault: boolean;
	images: string[];
};

const moneyStringSchema = z
	.string()
	.trim()
	.min(1, "Price is required")
	.refine((value) => Number.isFinite(Number(value)), "Price must be a number")
	.refine((value) => Number(value) >= 0, "Price must be 0 or greater");

const optionalMoneyStringSchema = z
	.string()
	.refine(
		(value) => value.trim() === "" || Number.isFinite(Number(value)),
		"Compare-at price must be a number",
	)
	.refine(
		(value) => value.trim() === "" || Number(value) >= 0,
		"Compare-at price must be 0 or greater",
	);

const variantFormSchema = z
	.object({
		productId: z.string().uuid("Product is required"),
		sku: z.string().trim().min(1, "SKU is required"),
		price: moneyStringSchema,
		compareAtPrice: optionalMoneyStringSchema,
		stockQuantity: z
			.string()
			.trim()
			.min(1, "Stock is required")
			.refine((value) => Number.isInteger(Number(value)), "Stock must be whole")
			.refine((value) => Number(value) >= 0, "Stock must be 0 or greater"),
		colorId: z.string().min(1, "Color is required"),
		storageId: z.string().min(1, "Storage is required"),
		ramId: z.string().min(1, "RAM is required"),
		screenSizeId: z.string().min(1, "Screen size is required"),
		isDefault: z.boolean(),
		images: z.array(z.string()).min(1, "At least one image is required"),
	})
	.refine(
		(value) =>
			value.compareAtPrice.trim() === "" ||
			Number(value.compareAtPrice) >= Number(value.price),
		{
			message: "Compare-at price cannot be less than price",
			path: ["compareAtPrice"],
		},
	);

function emptyVariantForm(productId: string): VariantFormValues {
	return {
		productId,
		sku: "",
		price: "",
		compareAtPrice: "",
		stockQuantity: "0",
		colorId: "",
		storageId: "",
		ramId: "",
		screenSizeId: "",
		isDefault: false,
		images: [],
	};
}

function variantToFormValues(
	variant: AdminVariantType | null,
	productId: string,
): VariantFormValues {
	if (!variant) return emptyVariantForm(productId);
	return {
		productId,
		sku: variant.sku,
		price: String(variant.price),
		compareAtPrice:
			variant.compareAtPrice === null ? "" : String(variant.compareAtPrice),
		stockQuantity: String(variant.stockQuantity),
		colorId: variant.color?.id ?? "",
		storageId: variant.storage?.id ?? "",
		ramId: variant.ram?.id ?? "",
		screenSizeId: variant.screenSize?.id ?? "",
		isDefault: variant.isDefault,
		images: variant.images,
	};
}

function formatCurrency(value: number) {
	return `$${value.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

function formatDate(value: string) {
	return new Date(value).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export function VariantsPage() {
	const [viewMode, setViewMode] = usePersistedViewMode(
		"admin:variants:view-mode",
	);

	const {
		productOptions,
		productSearch,
		isLoadingProducts,
		selectedProductId,
		selectedProduct,
		onProductChange,
		onProductSearchChange,
		onPrefetchProduct,
		variants,
		isLoading,
		isError,
		search,
		stockFilter,
		onSearchChange,
		onStockFilterChange,
		onPrefetchStockFilter,
		onPageChange,
		pagination,
		createOpen,
		setCreateOpen,
		editTarget,
		setEditTarget,
		deleteTarget,
		setDeleteTarget,
	} = useVariantsPage();
	const [detailTarget, setDetailTarget] = useState<AdminVariantType | null>(
		null,
	);
	const colorsQuery = useQuery(listColorsQueryOptions({}));
	const storagesQuery = useQuery(listStoragesQueryOptions({}));
	const ramsQuery = useQuery(listRamsQueryOptions({}));
	const screensQuery = useQuery(listScreensQueryOptions({}));
	const colors = colorsQuery.data?.data.items ?? [];
	const storages = storagesQuery.data?.data.items ?? [];
	const rams = ramsQuery.data?.data.items ?? [];
	const screens = screensQuery.data?.data.items ?? [];
	const isLoadingOptions =
		colorsQuery.isLoading ||
		storagesQuery.isLoading ||
		ramsQuery.isLoading ||
		screensQuery.isLoading;
	const isOptionsError =
		colorsQuery.isError ||
		storagesQuery.isError ||
		ramsQuery.isError ||
		screensQuery.isError;
	const missingOptionGroups = [
		colors.length === 0 ? "colors" : null,
		storages.length === 0 ? "storages" : null,
		rams.length === 0 ? "RAM" : null,
		screens.length === 0 ? "screens" : null,
	].filter(Boolean) as string[];
	const canCreateVariant =
		Boolean(selectedProductId) &&
		!isLoadingOptions &&
		!isOptionsError &&
		missingOptionGroups.length === 0;

	return (
		<div className="space-y-4 py-4 sm:py-6">
			<div>
				<h1 className="text-xl font-bold text-foreground">Variants</h1>
				<p className="mt-0.5 text-sm text-muted">
					Create variants after a product exists, then assign each variant to
					one product.
				</p>
			</div>

			<VariantProductPicker
				productOptions={productOptions}
				productSearch={productSearch}
				isLoadingProducts={isLoadingProducts}
				selectedProductId={selectedProductId}
				selectedProduct={selectedProduct}
				onProductChange={onProductChange}
				onProductSearchChange={onProductSearchChange}
				onPrefetchProduct={onPrefetchProduct}
			/>

			{isOptionsError ? (
				<FormNotice
					title="Variant options failed to load"
					description="Refresh the page before creating or editing variants."
				/>
			) : null}

			{!isLoadingOptions &&
			!isOptionsError &&
			missingOptionGroups.length > 0 ? (
				<FormNotice
					title="Create variant options first"
					description={`Missing ${missingOptionGroups.join(", ")}. Add them from Options, then create variants.`}
				/>
			) : null}

			<div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
				<VariantsToolbar
					search={search}
					onSearchChange={onSearchChange}
					stockFilter={stockFilter}
					onStockFilterChange={onStockFilterChange}
					onPrefetchStockFilter={onPrefetchStockFilter}
					totalCount={pagination.total}
					isCreateDisabled={!canCreateVariant}
					onCreateClick={() => setCreateOpen(true)}
				/>
				<ViewModeToggle value={viewMode} onChange={setViewMode} />
			</div>

			<div className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
				{!selectedProductId ? (
					<PanelState
						icon={Boxes}
						title="Select a product above to view its variants"
					/>
				) : isLoading ? (
					<PanelState icon={Boxes} title="Loading variants..." />
				) : isError ? (
					<PanelState icon={Boxes} title="Failed to load variants" />
				) : (
					<>
						{viewMode === "table" ? (
							<VariantsTable
								variants={variants}
								onView={setDetailTarget}
								onEdit={setEditTarget}
								onDelete={setDeleteTarget}
							/>
						) : null}
						{viewMode === "list" ? (
							<VariantsList
								variants={variants}
								onView={setDetailTarget}
								onEdit={setEditTarget}
								onDelete={setDeleteTarget}
							/>
						) : null}
						{viewMode === "cards" ? (
							<VariantsCards
								variants={variants}
								onView={setDetailTarget}
								onEdit={setEditTarget}
								onDelete={setDeleteTarget}
							/>
						) : null}

						<VariantsPagination
							currentPage={pagination.page}
							totalPages={pagination.totalPages}
							totalItems={pagination.total}
							limit={pagination.limit}
							onPageChange={onPageChange}
						/>
					</>
				)}
			</div>

			<VariantFormModal
				isOpen={createOpen}
				selectedProductId={selectedProductId}
				selectedProduct={selectedProduct}
				colors={colors}
				storages={storages}
				rams={rams}
				screens={screens}
				isLoadingOptions={isLoadingOptions}
				isOptionsError={isOptionsError}
				missingOptionGroups={missingOptionGroups}
				onClose={() => setCreateOpen(false)}
			/>
			<VariantFormModal
				variant={editTarget}
				isOpen={editTarget !== null}
				selectedProductId={selectedProductId}
				selectedProduct={selectedProduct}
				colors={colors}
				storages={storages}
				rams={rams}
				screens={screens}
				isLoadingOptions={isLoadingOptions}
				isOptionsError={isOptionsError}
				missingOptionGroups={missingOptionGroups}
				onClose={() => setEditTarget(null)}
			/>
			<VariantDetailSheet
				variant={detailTarget}
				product={selectedProduct}
				onClose={() => setDetailTarget(null)}
				onEdit={(variant) => {
					setDetailTarget(null);
					setEditTarget(variant);
				}}
				onDelete={(variant) => {
					setDetailTarget(null);
					setDeleteTarget(variant);
				}}
			/>
			<DeleteVariantDialog
				variant={deleteTarget}
				selectedProductId={selectedProductId}
				onClose={() => setDeleteTarget(null)}
			/>
		</div>
	);
}

function VariantsToolbar({
	search,
	onSearchChange,
	stockFilter,
	onStockFilterChange,
	onPrefetchStockFilter,
	totalCount,
	isCreateDisabled,
	onCreateClick,
}: {
	search: string;
	onSearchChange: (value: string) => void;
	stockFilter: StockFilter;
	onStockFilterChange: (value: StockFilter) => void;
	onPrefetchStockFilter: (value: StockFilter) => void;
	totalCount: number;
	isCreateDisabled: boolean;
	onCreateClick: () => void;
}) {
	const warmStockFilters = () => {
		for (const value of ["all", "in-stock", "empty"] as const) {
			onPrefetchStockFilter(value);
		}
	};

	return (
		<div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-3 min-[520px]:grid-cols-2 xl:flex xl:flex-wrap xl:items-center">
			<div className="relative min-w-0 min-[520px]:col-span-2 xl:col-span-1 xl:flex-1">
				<Search
					size={15}
					className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
				/>
				<input
					type="text"
					value={search}
					onChange={(event) => onSearchChange(event.target.value)}
					placeholder="Search SKUs..."
					className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
				/>
			</div>

			<select
				value={stockFilter}
				onChange={(event) =>
					onStockFilterChange(event.target.value as StockFilter)
				}
				onFocus={warmStockFilters}
				onMouseEnter={warmStockFilters}
				className="w-full min-w-0 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent/40 xl:w-auto"
			>
				<option value="all">All stock</option>
				<option value="in-stock">In stock</option>
				<option value="empty">Out of stock</option>
			</select>

			<Chip
				size="sm"
				variant="soft"
				color="default"
				className="justify-self-start"
			>
				{totalCount} {totalCount === 1 ? "variant" : "variants"}
			</Chip>

			<button
				type="button"
				onClick={onCreateClick}
				disabled={isCreateDisabled}
				className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50 min-[520px]:w-auto"
			>
				<Plus size={15} />
				New Variant
			</button>
		</div>
	);
}

function VariantProductPicker({
	productOptions,
	productSearch,
	isLoadingProducts,
	selectedProductId,
	selectedProduct,
	onProductChange,
	onProductSearchChange,
	onPrefetchProduct,
}: {
	productOptions: AdminProductListItemType[];
	productSearch: string;
	isLoadingProducts: boolean;
	selectedProductId: string;
	selectedProduct: AdminProductDetailsType | null;
	onProductChange: (productId: string) => void;
	onProductSearchChange: (value: string) => void;
	onPrefetchProduct: (productId: string) => void;
}) {
	return (
		<div className="min-w-0 rounded-2xl border border-border bg-default/30 p-4">
			<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
				<div className="min-w-0">
					<p className="text-sm font-semibold text-foreground">
						Selected product: {selectedProduct ? selectedProduct.name : "None"}
					</p>
					{selectedProduct ? (
						<div className="mt-2 grid gap-2 text-xs text-muted md:grid-cols-2">
							<span className="min-w-0 break-words">
								{selectedProduct.brand} / {selectedProduct.slug}
							</span>
							<span className="min-w-0 break-all font-mono">
								{selectedProduct.id}
							</span>
						</div>
					) : (
						<p className="mt-1 text-xs text-muted">
							Search by product name, brand, slug, or ID, then choose a product.
						</p>
					)}
				</div>

				<div className="min-w-0 space-y-2">
					<div className="relative">
						<Search
							size={15}
							className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
						/>
						<input
							type="text"
							value={productSearch}
							onChange={(event) => onProductSearchChange(event.target.value)}
							placeholder="Find product..."
							className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
						/>
					</div>

					<div className="max-h-56 space-y-2 overflow-y-auto">
						{isLoadingProducts ? (
							<p className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted">
								Loading products...
							</p>
						) : null}
						{!isLoadingProducts && productOptions.length === 0 ? (
							<p className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted">
								No products found.
							</p>
						) : null}
						{productOptions.map((product) => (
							<button
								key={product.id}
								type="button"
								onClick={() => onProductChange(product.id)}
								onFocus={() => onPrefetchProduct(product.id)}
								onMouseEnter={() => onPrefetchProduct(product.id)}
								className={[
									"flex w-full min-w-0 flex-col items-start gap-2 rounded-xl border px-3 py-2 text-left transition-colors min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between",
									product.id === selectedProductId
										? "border-accent bg-accent/10"
										: "border-border bg-surface hover:bg-default/50",
								]
									.filter(Boolean)
									.join(" ")}
							>
								<span className="min-w-0">
									<span className="block truncate text-sm font-medium text-foreground">
										{product.name}
									</span>
									<span className="block truncate text-xs text-muted">
										{product.brand} / {product.slug}
									</span>
								</span>
								{product.id === selectedProductId ? (
									<Chip size="sm" variant="soft" color="accent">
										Selected
									</Chip>
								) : null}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function VariantImage({ variant }: { variant: AdminVariantType }) {
	const image = variant.images[0];

	if (image) {
		return (
			<img
				src={image}
				alt={variant.sku}
				className="size-11 rounded-xl border border-border object-cover"
			/>
		);
	}

	return (
		<div className="flex size-11 items-center justify-center rounded-xl border border-border bg-default/50 text-muted">
			<ImageIcon size={17} />
		</div>
	);
}

function VariantOptions({ variant }: { variant: AdminVariantType }) {
	const options = [
		variant.color?.name,
		variant.storage?.name,
		variant.ram?.name,
		variant.screenSize?.name,
	].filter(Boolean);

	if (options.length === 0) {
		return <span className="text-xs text-muted">No options</span>;
	}

	return (
		<div className="flex flex-wrap gap-1.5">
			{options.map((option) => (
				<Chip key={option} size="sm" variant="soft" color="default">
					{option}
				</Chip>
			))}
		</div>
	);
}

function VariantsTable({
	variants,
	onView,
	onEdit,
	onDelete,
}: {
	variants: AdminVariantType[];
	onView: (variant: AdminVariantType) => void;
	onEdit: (variant: AdminVariantType) => void;
	onDelete: (variant: AdminVariantType) => void;
}) {
	if (variants.length === 0) {
		return <PanelState icon={Boxes} title="No variants found" />;
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-border">
						<th className="px-2 py-3 text-left text-xs font-semibold text-muted">
							Variant
						</th>
						<th className="px-2 py-3 text-left text-xs font-semibold text-muted">
							Options
						</th>
						<th className="px-2 py-3 text-left text-xs font-semibold text-muted">
							Price
						</th>
						<th className="px-2 py-3 text-left text-xs font-semibold text-muted">
							Stock
						</th>
						<th className="px-2 py-3 text-left text-xs font-semibold text-muted">
							Status
						</th>
						<th className="px-2 py-3 text-left text-xs font-semibold text-muted">
							Updated
						</th>
						<th className="px-2 py-3 text-right text-xs font-semibold text-muted">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{variants.map((variant) => (
						<tr
							key={variant.id}
							onClick={() => onView(variant)}
							className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-default/50"
						>
							<td className="px-2 py-3">
								<div className="flex items-center gap-3">
									<VariantImage variant={variant} />
									<div className="min-w-0">
										<p className="break-all font-mono text-xs font-medium text-foreground">
											{variant.sku}
										</p>
										<p className="text-xs text-muted">
											{variant.images.length} images
										</p>
									</div>
								</div>
							</td>
							<td className="px-2 py-3">
								<VariantOptions variant={variant} />
							</td>
							<td className="px-2 py-3">
								<div>
									<p className="font-medium text-foreground">
										{formatCurrency(variant.price)}
									</p>
									{variant.compareAtPrice ? (
										<p className="text-xs text-muted line-through">
											{formatCurrency(variant.compareAtPrice)}
										</p>
									) : null}
								</div>
							</td>
							<td className="px-2 py-3">
								<Chip
									size="sm"
									variant="soft"
									color={variant.stockQuantity > 0 ? "success" : "danger"}
								>
									{variant.stockQuantity}
								</Chip>
							</td>
							<td className="px-2 py-3">
								{variant.isDefault ? (
									<Chip size="sm" variant="soft" color="accent">
										Default
									</Chip>
								) : (
									<Chip size="sm" variant="soft" color="default">
										Optional
									</Chip>
								)}
							</td>
							<td className="whitespace-nowrap px-2 py-3 text-muted">
								{formatDate(variant.updatedAt)}
							</td>
							<td className="px-2 py-3">
								<VariantActions
									variant={variant}
									onEdit={onEdit}
									onDelete={onDelete}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function VariantsList({
	variants,
	onView,
	onEdit,
	onDelete,
}: {
	variants: AdminVariantType[];
	onView: (variant: AdminVariantType) => void;
	onEdit: (variant: AdminVariantType) => void;
	onDelete: (variant: AdminVariantType) => void;
}) {
	if (variants.length === 0) {
		return <PanelState icon={Boxes} title="No variants found" />;
	}

	return (
		<div className="divide-y divide-border">
			{variants.map((variant) => (
				<div
					key={variant.id}
					className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
				>
					<button
						type="button"
						onClick={() => onView(variant)}
						className="flex min-w-0 flex-1 items-center gap-3 text-left"
					>
						<VariantImage variant={variant} />
						<div className="min-w-0">
							<p className="break-all font-mono text-xs font-medium text-foreground">
								{variant.sku}
							</p>
							<div className="mt-2">
								<VariantOptions variant={variant} />
							</div>
						</div>
					</button>
					<div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
						<div className="min-w-0 text-left sm:text-right">
							<p className="text-sm font-semibold text-foreground">
								{formatCurrency(variant.price)}
							</p>
							<p className="text-xs text-muted">
								Stock {variant.stockQuantity}
							</p>
						</div>
						<VariantActions
							variant={variant}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					</div>
				</div>
			))}
		</div>
	);
}

function VariantsCards({
	variants,
	onView,
	onEdit,
	onDelete,
}: {
	variants: AdminVariantType[];
	onView: (variant: AdminVariantType) => void;
	onEdit: (variant: AdminVariantType) => void;
	onDelete: (variant: AdminVariantType) => void;
}) {
	if (variants.length === 0) {
		return <PanelState icon={Boxes} title="No variants found" />;
	}

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
			{variants.map((variant) => (
				<div
					key={variant.id}
					className="rounded-2xl border border-border bg-default/30 p-4"
				>
					<button
						type="button"
						onClick={() => onView(variant)}
						className="block w-full text-left"
					>
						<div className="flex min-w-0 flex-col gap-3 min-[360px]:flex-row min-[360px]:items-start min-[360px]:justify-between">
							<div className="flex min-w-0 items-center gap-3">
								<VariantImage variant={variant} />
								<div className="min-w-0">
									<p className="break-all font-mono text-xs font-medium text-muted">
										{variant.sku}
									</p>
								</div>
							</div>
							{variant.isDefault ? (
								<Chip size="sm" variant="soft" color="accent">
									Default
								</Chip>
							) : null}
						</div>

						<div className="mt-4">
							<VariantOptions variant={variant} />
						</div>

						<div className="mt-4 flex min-w-0 flex-col gap-2 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between">
							<div className="min-w-0">
								<p className="break-words text-sm font-bold text-foreground">
									{formatCurrency(variant.price)}
								</p>
								<p className="text-xs text-muted">
									{variant.stockQuantity} in stock
								</p>
							</div>
							<Chip size="sm" variant="soft" color="default">
								{variant.images.length} images
							</Chip>
						</div>
					</button>

					<div className="mt-4 flex flex-col gap-2 border-t border-border pt-3 text-xs text-muted min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between">
						<span className="break-words">
							Updated {formatDate(variant.updatedAt)}
						</span>
						<VariantActions
							variant={variant}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					</div>
				</div>
			))}
		</div>
	);
}

function VariantActions({
	variant,
	onEdit,
	onDelete,
}: {
	variant: AdminVariantType;
	onEdit: (variant: AdminVariantType) => void;
	onDelete: (variant: AdminVariantType) => void;
}) {
	return (
		<div className="flex items-center justify-end gap-1">
			<Button
				isIconOnly
				size="sm"
				variant="ghost"
				onClick={(event) => event.stopPropagation()}
				onPress={() => onEdit(variant)}
				aria-label={`Edit ${variant.sku}`}
				className="text-muted hover:text-foreground"
			>
				<Pencil size={15} />
			</Button>
			<Button
				isIconOnly
				size="sm"
				variant="ghost"
				onClick={(event) => event.stopPropagation()}
				onPress={() => onDelete(variant)}
				aria-label={`Delete ${variant.sku}`}
				className="text-muted hover:text-danger"
			>
				<Trash2 size={15} />
			</Button>
		</div>
	);
}

function VariantsPagination({
	currentPage,
	totalPages,
	totalItems,
	limit,
	onPageChange,
}: {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	limit: number;
	onPageChange: (page: number) => void;
}) {
	if (totalItems === 0) return null;

	return (
		<WindowedPagination
			currentPage={currentPage}
			totalPages={totalPages}
			totalItems={totalItems}
			limit={limit}
			itemLabel="variant"
			onPageChange={onPageChange}
			onPrefetchPage={() => undefined}
			className="mt-4 border-t border-border pt-4"
			showSummaryWhenSinglePage
		/>
	);
}

function VariantFormModal({
	isOpen,
	onClose,
	selectedProductId,
	selectedProduct,
	colors,
	storages,
	rams,
	screens,
	isLoadingOptions,
	isOptionsError,
	missingOptionGroups,
	variant = null,
}: {
	isOpen: boolean;
	onClose: () => void;
	selectedProductId: string;
	selectedProduct: AdminProductDetailsType | null;
	colors: Color[];
	storages: Storage[];
	rams: Ram[];
	screens: Screen[];
	isLoadingOptions: boolean;
	isOptionsError: boolean;
	missingOptionGroups: string[];
	variant?: AdminVariantType | null;
}) {
	const isEdit = variant !== null;
	const canSubmitVariant =
		Boolean(selectedProductId) &&
		!isLoadingOptions &&
		!isOptionsError &&
		missingOptionGroups.length === 0;

	const createVariant = useCreateVariant();
	const updateVariant = useUpdateVariant({ productId: selectedProductId });

	const form = useForm({
		defaultValues: emptyVariantForm(selectedProductId),
		validators: {
			onSubmit: variantFormSchema,
		},
		onSubmit: async ({ value }) => {
			if (!canSubmitVariant) return;
			const price = Number(value.price);
			const compareAtPrice = value.compareAtPrice
				? Number(value.compareAtPrice)
				: null;
			const stockQuantity = Number(value.stockQuantity);
			const colorId = value.colorId;
			const storageId = value.storageId;
			const ramId = value.ramId;
			const screenSizeId = value.screenSizeId;

			if (isEdit) {
				await updateVariant.mutateAsync({
					variantId: variant.id,
					sku: value.sku,
					price,
					compareAtPrice,
					stockQuantity,
					colorId,
					storageId,
					ramId,
					screenSizeId,
					isDefault: value.isDefault,
					images: value.images,
				});
			} else {
				await createVariant.mutateAsync({
					productId: value.productId,
					sku: value.sku,
					price,
					compareAtPrice,
					stockQuantity,
					colorId,
					storageId,
					ramId,
					screenSizeId,
					isDefault: value.isDefault,
					images: value.images,
				});
			}
			onClose();
		},
	});

	const { Field, Subscribe, handleSubmit, reset, setFieldValue } = form;

	useEffect(() => {
		if (!isOpen) {
			reset();
			return;
		}
		const nextValues = variantToFormValues(variant, selectedProductId);
		for (const key of Object.keys(nextValues) as (keyof VariantFormValues)[]) {
			setFieldValue(key, nextValues[key]);
		}
	}, [isOpen, selectedProductId, setFieldValue, variant, reset]);

	function handleClose() {
		reset();
		onClose();
	}

	return (
		<Modal.Root isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog>
						<Form
							onSubmit={(event) => {
								event.preventDefault();
								event.stopPropagation();
								handleSubmit();
							}}
						>
							<Modal.Header>
								<Modal.Heading className="text-base font-semibold text-foreground">
									{isEdit ? "Edit Variant" : "New Variant"}
								</Modal.Heading>
								<Modal.CloseTrigger className="text-muted hover:text-foreground">
									<X size={18} />
								</Modal.CloseTrigger>
							</Modal.Header>

							<Modal.Body className="max-h-[70vh] space-y-4 overflow-y-auto">
								{isLoadingOptions ? (
									<FormNotice
										title="Loading options"
										description="Colors, storage, RAM, and screen sizes are loading."
									/>
								) : null}

								{isOptionsError ? (
									<FormNotice
										title="Variant options failed to load"
										description="Refresh the page before saving this variant."
									/>
								) : null}

								{!selectedProductId ? (
									<FormNotice
										title="Select a product first"
										description="Search for a product, select it, then create its variant."
									/>
								) : null}

								{!isLoadingOptions &&
								!isOptionsError &&
								missingOptionGroups.length > 0 ? (
									<FormNotice
										title="Create variant options first"
										description={`Missing ${missingOptionGroups.join(", ")}. Add them from Options, then save the variant.`}
									/>
								) : null}

								<Field name="productId">
									{(field) => (
										<div className="rounded-xl border border-border bg-default/30 p-3">
											<p className="text-sm font-medium text-foreground">
												{selectedProduct
													? `${selectedProduct.brand} - ${selectedProduct.name}`
													: "No product selected"}
											</p>
											<p className="mt-1 break-all font-mono text-xs text-muted">
												{field.state.value ||
													"Select a product from the search above"}
											</p>
											{getAdminFieldError(field, form) ? (
												<p className="mt-1 text-xs text-danger">
													{getAdminFieldError(field, form)}
												</p>
											) : null}
										</div>
									)}
								</Field>

								<div className="grid gap-4 md:grid-cols-2">
									<Field name="sku">
										{(field) => (
											<InputField
												label="SKU"
												placeholder="e.g. MBP14-M3-18-512-BLK"
												value={field.state.value}
												onChange={(value) => field.handleChange(value)}
												onBlur={field.handleBlur}
												errorText={getAdminFieldError(field, form)}
											/>
										)}
									</Field>
									<Field name="stockQuantity">
										{(field) => (
											<InputField
												label="Stock quantity"
												placeholder="0"
												value={field.state.value}
												onChange={(value) =>
													field.handleChange(value.replace(/[^0-9]/g, ""))
												}
												onBlur={field.handleBlur}
												errorText={getAdminFieldError(field, form)}
											/>
										)}
									</Field>
								</div>

								<div className="grid gap-4 md:grid-cols-2">
									<Field name="price">
										{(field) => (
											<InputField
												label="Price"
												placeholder="1999"
												value={field.state.value}
												onChange={(value) =>
													field.handleChange(value.replace(/[^0-9.]/g, ""))
												}
												onBlur={field.handleBlur}
												errorText={getAdminFieldError(field, form)}
											/>
										)}
									</Field>
									<Field name="compareAtPrice">
										{(field) => (
											<InputField
												label="Compare-at price"
												placeholder="2199"
												value={field.state.value}
												onChange={(value) =>
													field.handleChange(value.replace(/[^0-9.]/g, ""))
												}
												onBlur={field.handleBlur}
												errorText={getAdminFieldError(field, form)}
											/>
										)}
									</Field>
								</div>

								<div className="grid gap-4 md:grid-cols-2">
									<Field name="colorId">
										{(field) => (
											<SelectField
												label="Color"
												value={field.state.value}
												onChange={(value) => field.handleChange(value)}
												errorText={getAdminFieldError(field, form)}
											>
												<option value="">Select color</option>
												{colors.map((option) => (
													<option key={option.id} value={option.id}>
														{option.name}
													</option>
												))}
											</SelectField>
										)}
									</Field>
									<Field name="storageId">
										{(field) => (
											<SelectField
												label="Storage"
												value={field.state.value}
												onChange={(value) => field.handleChange(value)}
												errorText={getAdminFieldError(field, form)}
											>
												<option value="">Select storage</option>
												{storages.map((option) => (
													<option key={option.id} value={option.id}>
														{option.name}
													</option>
												))}
											</SelectField>
										)}
									</Field>
									<Field name="ramId">
										{(field) => (
											<SelectField
												label="RAM"
												value={field.state.value}
												onChange={(value) => field.handleChange(value)}
												errorText={getAdminFieldError(field, form)}
											>
												<option value="">Select RAM</option>
												{rams.map((option) => (
													<option key={option.id} value={option.id}>
														{option.name}
													</option>
												))}
											</SelectField>
										)}
									</Field>
									<Field name="screenSizeId">
										{(field) => (
											<SelectField
												label="Screen size"
												value={field.state.value}
												onChange={(value) => field.handleChange(value)}
												errorText={getAdminFieldError(field, form)}
											>
												<option value="">Select screen size</option>
												{screens.map((option) => (
													<option key={option.id} value={option.id}>
														{option.name}
													</option>
												))}
											</SelectField>
										)}
									</Field>
								</div>

								<Field name="images">
									{(field) => (
										<div className="space-y-3">
											<p className="text-sm font-medium text-foreground">
												Images
											</p>

											<AdminImageUploader
												label="Variant image"
												helperText="Upload images one at a time. Each completed upload is added to this variant."
												onUploaded={(imageUrl) => {
													field.handleChange([...field.state.value, imageUrl]);
												}}
											/>

											{field.state.value.length > 0 ? (
												<div className="grid gap-2 sm:grid-cols-2">
													{field.state.value.map((imageUrl, index) => (
														<div
															key={imageUrl}
															className="flex items-center gap-2 rounded-xl border border-border bg-surface p-2"
														>
															<img
																src={imageUrl}
																alt={`Variant upload ${index + 1}`}
																className="size-10 rounded-lg object-cover"
															/>
															<p className="min-w-0 flex-1 truncate text-xs text-muted">
																{imageUrl}
															</p>
															<Button
																type="button"
																isIconOnly
																size="sm"
																variant="ghost"
																onPress={() =>
																	field.handleChange(
																		field.state.value.filter(
																			(_, imageIndex) => imageIndex !== index,
																		),
																	)
																}
																aria-label="Remove image"
															>
																<X size={14} />
															</Button>
														</div>
													))}
												</div>
											) : null}
											{getAdminFieldError(field, form) ? (
												<p className="text-xs text-danger">
													{getAdminFieldError(field, form)}
												</p>
											) : null}
										</div>
									)}
								</Field>

								<Field name="isDefault">
									{(field) => (
										<CheckboxField
											label="Default variant"
											description="Only one variant per product should be default. The service will unset the old default automatically."
											checked={field.state.value}
											onChange={(value) => field.handleChange(value)}
											icon={CheckCircle2}
										/>
									)}
								</Field>
							</Modal.Body>

							<Modal.Footer className="gap-2">
								<Subscribe>
									{({ isSubmitting }) => (
										<>
											<Button
												variant="outline"
												size="sm"
												onPress={handleClose}
												isDisabled={isSubmitting}
											>
												Cancel
											</Button>
											<Button
												type="submit"
												variant="primary"
												size="sm"
												isPending={isSubmitting}
												isDisabled={isSubmitting || !canSubmitVariant}
											>
												{isEdit ? "Save changes" : "Create Variant"}
											</Button>
										</>
									)}
								</Subscribe>
							</Modal.Footer>
						</Form>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal.Root>
	);
}

function VariantDetailSheet({
	variant,
	product,
	onClose,
	onEdit,
	onDelete,
}: {
	variant: AdminVariantType | null;
	product: AdminProductDetailsType | null;
	onClose: () => void;
	onEdit: (variant: AdminVariantType) => void;
	onDelete: (variant: AdminVariantType) => void;
}) {
	return (
		<AdminDetailSheet
			isOpen={variant !== null}
			onClose={onClose}
			title={variant?.sku ?? "Variant"}
			subtitle={product ? `${product.brand} / ${product.name}` : undefined}
			badge={
				variant?.isDefault ? (
					<Chip size="sm" variant="soft" color="accent">
						Default
					</Chip>
				) : null
			}
			footer={
				variant ? (
					<>
						<Button size="sm" variant="outline" onPress={() => onEdit(variant)}>
							Edit
						</Button>
						<Button
							size="sm"
							variant="danger"
							onPress={() => onDelete(variant)}
						>
							Delete
						</Button>
					</>
				) : null
			}
		>
			{variant ? (
				<div className="space-y-5">
					{variant.images.length > 0 ? (
						<div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
							{variant.images.map((image, index) => (
								<img
									key={image}
									src={image}
									alt={`${variant.sku} ${index + 1}`}
									className="h-32 w-full rounded-xl border border-border object-cover"
								/>
							))}
						</div>
					) : null}

					<DetailSection title="Variant">
						<DetailRow label="ID" value={variant.id} mono />
						<DetailRow label="SKU" value={variant.sku} mono />
						<DetailRow label="Product" value={product?.name ?? "Product"} />
						<DetailRow
							label="Product ID"
							value={product?.id ?? "Unknown"}
							mono
						/>
						<DetailRow label="Created" value={formatDate(variant.createdAt)} />
						<DetailRow label="Updated" value={formatDate(variant.updatedAt)} />
					</DetailSection>

					<DetailSection title="Pricing and Stock">
						<DetailRow label="Price" value={formatCurrency(variant.price)} />
						<DetailRow
							label="Compare at"
							value={
								variant.compareAtPrice
									? formatCurrency(variant.compareAtPrice)
									: "None"
							}
						/>
						<DetailRow label="Stock" value={variant.stockQuantity} />
						<DetailRow
							label="Default"
							value={variant.isDefault ? "Yes" : "No"}
						/>
					</DetailSection>

					<DetailSection title="Options">
						<DetailRow label="Color" value={variant.color?.name ?? "None"} />
						<DetailRow
							label="Color hex"
							value={variant.color?.hexCode ?? "None"}
							mono
						/>
						<DetailRow
							label="Storage"
							value={variant.storage?.name ?? "None"}
						/>
						<DetailRow label="RAM" value={variant.ram?.name ?? "None"} />
						<DetailRow
							label="Screen"
							value={variant.screenSize?.name ?? "None"}
						/>
					</DetailSection>
				</div>
			) : null}
		</AdminDetailSheet>
	);
}

function FormNotice({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="rounded-2xl border border-border bg-default/30 p-4">
			<p className="text-sm font-semibold text-foreground">{title}</p>
			<p className="mt-1 text-sm text-muted">{description}</p>
		</div>
	);
}

function DeleteVariantDialog({
	variant,
	selectedProductId,
	onClose,
}: {
	variant: AdminVariantType | null;
	selectedProductId: string;
	onClose: () => void;
}) {
	const deleteVariant = useDeleteVariant({
		productId: selectedProductId,
		onSuccess: onClose,
	});

	function handleDelete() {
		if (!variant) return;
		deleteVariant.mutate({ variantId: variant.id });
	}

	return (
		<AlertDialog.Root
			isOpen={variant !== null}
			onOpenChange={(open) => !open && onClose()}
		>
			<AlertDialog.Backdrop>
				<AlertDialog.Container>
					<AlertDialog.Dialog>
						<AlertDialog.Header>
							<div className="flex items-center gap-3">
								<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger/10">
									<Trash2 size={18} className="text-danger" />
								</div>
								<AlertDialog.Heading className="text-base font-semibold text-foreground">
									Delete "{variant?.sku}"?
								</AlertDialog.Heading>
							</div>
						</AlertDialog.Header>

						<AlertDialog.Body>
							<p className="text-sm text-muted">
								This will permanently delete the variant. If it was the default,
								another variant will be promoted automatically.
							</p>
						</AlertDialog.Body>

						<AlertDialog.Footer className="gap-2">
							<Button
								variant="outline"
								size="sm"
								onPress={onClose}
								isDisabled={deleteVariant.isPending}
							>
								Cancel
							</Button>
							<Button
								variant="danger"
								size="sm"
								onPress={handleDelete}
								isPending={deleteVariant.isPending}
							>
								Delete Variant
							</Button>
						</AlertDialog.Footer>
					</AlertDialog.Dialog>
				</AlertDialog.Container>
			</AlertDialog.Backdrop>
		</AlertDialog.Root>
	);
}

function SelectField({
	label,
	value,
	onChange,
	children,
	errorText,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	children: ReactNode;
	errorText?: string;
}) {
	return (
		<label className="flex flex-col gap-1.5">
			<span className="text-sm font-medium text-foreground">{label}</span>
			<select
				value={value}
				onChange={(event) => onChange(event.target.value)}
				className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
			>
				{children}
			</select>
			{errorText ? (
				<span className="text-xs text-danger">{errorText}</span>
			) : null}
		</label>
	);
}

function CheckboxField({
	label,
	description,
	checked,
	onChange,
	icon: Icon,
}: {
	label: string;
	description: string;
	checked: boolean;
	onChange: (value: boolean) => void;
	icon: LucideIcon;
}) {
	return (
		<label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-default/30 p-3">
			<input
				type="checkbox"
				checked={checked}
				onChange={(event) => onChange(event.target.checked)}
				className="mt-1 size-4 accent-[var(--accent)]"
			/>
			<Icon
				size={16}
				className={checked ? "mt-0.5 text-accent" : "mt-0.5 text-muted"}
			/>
			<span>
				<span className="block text-sm font-medium text-foreground">
					{label}
				</span>
				<span className="mt-1 block text-xs text-muted">{description}</span>
			</span>
		</label>
	);
}

function PanelState({
	icon: Icon,
	title,
}: {
	icon: LucideIcon;
	title: string;
}) {
	return (
		<div className="flex flex-col items-center gap-3 py-16 text-center">
			<Icon size={28} className="text-muted" />
			<p className="text-sm font-medium text-foreground">{title}</p>
		</div>
	);
}
