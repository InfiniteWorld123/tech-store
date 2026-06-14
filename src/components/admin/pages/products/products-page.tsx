import {
	AlertDialog,
	Button,
	Chip,
	Form,
	Modal,
	Skeleton,
} from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import {
	Archive,
	BadgeDollarSign,
	Boxes,
	CheckCircle2,
	DatabaseZap,
	ImageIcon,
	type LucideIcon,
	Pencil,
	Plus,
	Search,
	Settings2,
	Star,
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
import { RichTextEditor } from "#/components/admin/ui/rich-text-editor";
import { InputField } from "#/components/ui/fields/input-field";
import {
	usePersistedViewMode,
	ViewModeToggle,
} from "#/components/ui/view-mode-toggle";
import { useCreateProduct } from "#/mutations/products/use-create-product";
import { useDeleteProduct } from "#/mutations/products/use-delete-product";
import { useSeedCatalog } from "#/mutations/products/use-seed-catalog";
import { useUpdateProduct } from "#/mutations/products/use-update-product";
import { listCategoriesQueryOptions } from "#/queries/categories.queries";
import { getProductQueryOptions } from "#/queries/products.queries";
import type { CategoryWithCount } from "#/server/catalog/categories/categories.types";
import type { AdminProductDetailsType } from "#/server/catalog/products/products.types";
import type { FlagFilter, StatusFilter } from "./products.types";
import {
	type AdminProductListItemType,
	useProductsPage,
} from "./use-products-page";

type ProductFormValues = {
	categoryId: string;
	name: string;
	brand: string;
	slug: string;
	shortDescription: string;
	description: string;
	warrantyInfo: string;
	image: string;
	isFeatured: boolean;
	isBestseller: boolean;
	isActive: boolean;
};

function stripHtml(value: string) {
	return value
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

const productFormSchema = z.object({
	categoryId: z.string().min(1, "Category is required"),
	name: z.string().trim().min(2, "Name must be at least 2 characters"),
	brand: z.string().trim().min(1, "Brand is required"),
	slug: z.string().trim().min(1, "Slug is required"),
	shortDescription: z.string(),
	description: z
		.string()
		.refine((value) => stripHtml(value).length > 0, "Description is required"),
	warrantyInfo: z.string(),
	image: z.string(),
	isFeatured: z.boolean(),
	isBestseller: z.boolean(),
	isActive: z.boolean(),
});

function emptyProductForm(categories: CategoryWithCount[]): ProductFormValues {
	return {
		categoryId: categories[0]?.id ?? "",
		name: "",
		brand: "",
		slug: "",
		shortDescription: "",
		description: "",
		warrantyInfo: "",
		image: "",
		isFeatured: false,
		isBestseller: false,
		isActive: true,
	};
}

function productDetailToFormValues(
	product: AdminProductDetailsType | null | undefined,
	categories: CategoryWithCount[],
): ProductFormValues {
	if (!product) return emptyProductForm(categories);
	return {
		categoryId: product.category.id,
		name: product.name,
		brand: product.brand,
		slug: product.slug,
		shortDescription: product.shortDescription ?? "",
		description: product.description,
		warrantyInfo: product.warrantyInfo ?? "",
		image: product.image ?? "",
		isFeatured: product.isFeatured,
		isBestseller: product.isBestseller,
		isActive: product.isActive,
	};
}

const fallbackProductForm: ProductFormValues = {
	categoryId: "",
	name: "",
	brand: "",
	slug: "",
	shortDescription: "",
	description: "",
	warrantyInfo: "",
	image: "",
	isFeatured: false,
	isBestseller: false,
	isActive: true,
};

function toSlug(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

function formatCurrency(value: number | null) {
	if (value === null) return "No price";
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

function nullableText(value: string) {
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}

export function ProductsPage() {
	const [viewMode, setViewMode] = usePersistedViewMode(
		"admin:products:view-mode",
	);
	const {
		items,
		pagination,
		isLoading,
		isError,
		search,
		categoryId,
		status,
		flag,
		onSearchChange,
		onCategoryChange,
		onStatusChange,
		onFlagChange,
		onPageChange,
		onPrefetchPage,
		onPrefetchCategory,
		onPrefetchStatus,
		onPrefetchFlag,
		createOpen,
		setCreateOpen,
		editTarget,
		setEditTarget,
		deleteTarget,
		setDeleteTarget,
		handleManageVariants,
	} = useProductsPage();
	const [detailTarget, setDetailTarget] =
		useState<AdminProductListItemType | null>(null);
	const seedCatalog = useSeedCatalog();

	const {
		data: categoriesData,
		isLoading: isLoadingCategories,
		isError: isCategoriesError,
	} = useQuery(listCategoriesQueryOptions({}));
	const categories = categoriesData?.data.items ?? [];

	return (
		<div className="space-y-4 py-6">
			<div>
				<h1 className="text-xl font-bold text-foreground">Products</h1>
				<p className="text-sm text-muted mt-0.5">
					Build products first, then create their variants separately.
				</p>
			</div>

			<div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
				<ProductToolbar
					search={search}
					onSearchChange={onSearchChange}
					categoryId={categoryId}
					onCategoryChange={onCategoryChange}
					onPrefetchCategory={onPrefetchCategory}
					categories={categories}
					status={status}
					onStatusChange={onStatusChange}
					onPrefetchStatus={onPrefetchStatus}
					flag={flag}
					onFlagChange={onFlagChange}
					onPrefetchFlag={onPrefetchFlag}
					totalCount={pagination?.total ?? 0}
					onCreateClick={() => setCreateOpen(true)}
					onSeedClick={() => {
						const confirmed = window.confirm(
							"Seed the catalog with 500 realistic tech products and variants? Existing seeded slugs and SKUs will be skipped.",
						);

						if (confirmed) {
							seedCatalog.mutate();
						}
					}}
					isSeeding={seedCatalog.isPending}
				/>
				<ViewModeToggle value={viewMode} onChange={setViewMode} />
			</div>

			<div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
				{isLoading ? (
					<PanelState icon={Boxes} title="Loading products..." />
				) : isError ? (
					<PanelState icon={Archive} title="Failed to load products" />
				) : (
					<>
						{viewMode === "table" ? (
							<ProductsTable
								products={items}
								onView={setDetailTarget}
								onEdit={setEditTarget}
								onDelete={setDeleteTarget}
								onManageVariants={handleManageVariants}
							/>
						) : null}
						{viewMode === "list" ? (
							<ProductsList
								products={items}
								onView={setDetailTarget}
								onEdit={setEditTarget}
								onDelete={setDeleteTarget}
								onManageVariants={handleManageVariants}
							/>
						) : null}
						{viewMode === "cards" ? (
							<ProductsCards
								products={items}
								onView={setDetailTarget}
								onEdit={setEditTarget}
								onDelete={setDeleteTarget}
								onManageVariants={handleManageVariants}
							/>
						) : null}
						{pagination ? (
							<ProductsPagination
								currentPage={pagination.page}
								totalPages={pagination.totalPages}
								totalItems={pagination.total}
								limit={pagination.limit}
								onPageChange={onPageChange}
								onPrefetchPage={onPrefetchPage}
							/>
						) : null}
					</>
				)}
			</div>

			<ProductFormModal
				isOpen={createOpen}
				categories={categories}
				isLoadingCategories={isLoadingCategories}
				isCategoriesError={isCategoriesError}
				onClose={() => setCreateOpen(false)}
			/>
			<ProductFormModal
				product={editTarget}
				isOpen={editTarget !== null}
				categories={categories}
				isLoadingCategories={isLoadingCategories}
				isCategoriesError={isCategoriesError}
				onClose={() => setEditTarget(null)}
			/>
			<ProductDetailSheet
				product={detailTarget}
				onClose={() => setDetailTarget(null)}
				onEdit={(product) => {
					setDetailTarget(null);
					setEditTarget(product);
				}}
				onDelete={(product) => {
					setDetailTarget(null);
					setDeleteTarget(product);
				}}
				onManageVariants={(product) => {
					setDetailTarget(null);
					handleManageVariants(product);
				}}
			/>
			<DeleteProductDialog
				product={deleteTarget}
				onClose={() => setDeleteTarget(null)}
			/>
		</div>
	);
}

function ProductToolbar({
	search,
	onSearchChange,
	categoryId,
	onCategoryChange,
	onPrefetchCategory,
	categories,
	status,
	onStatusChange,
	onPrefetchStatus,
	flag,
	onFlagChange,
	onPrefetchFlag,
	totalCount,
	onCreateClick,
	onSeedClick,
	isSeeding,
}: {
	search: string;
	onSearchChange: (value: string) => void;
	categoryId: string;
	onCategoryChange: (value: string) => void;
	onPrefetchCategory: (value: string) => void;
	categories: CategoryWithCount[];
	status: StatusFilter;
	onStatusChange: (value: StatusFilter) => void;
	onPrefetchStatus: (value: StatusFilter) => void;
	flag: FlagFilter;
	onFlagChange: (value: FlagFilter) => void;
	onPrefetchFlag: (value: FlagFilter) => void;
	totalCount: number;
	onCreateClick: () => void;
	onSeedClick: () => void;
	isSeeding: boolean;
}) {
	const warmCategories = () => {
		onPrefetchCategory("");
		for (const category of categories) {
			onPrefetchCategory(category.id);
		}
	};
	const warmStatuses = () => {
		for (const value of ["all", "active", "inactive"] as const) {
			onPrefetchStatus(value);
		}
	};
	const warmFlags = () => {
		for (const value of [
			"all",
			"featured",
			"bestseller",
			"in-stock",
			"out-of-stock",
		] as const) {
			onPrefetchFlag(value);
		}
	};

	return (
		<div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
			<div className="relative min-w-60 flex-1">
				<Search
					size={15}
					className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
				/>
				<input
					type="text"
					value={search}
					onChange={(event) => onSearchChange(event.target.value)}
					placeholder="Search products..."
					className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
				/>
			</div>

			<select
				value={categoryId}
				onChange={(event) => onCategoryChange(event.target.value)}
				onFocus={warmCategories}
				onMouseEnter={warmCategories}
				className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
			>
				<option value="">All categories</option>
				{categories.map((category) => (
					<option key={category.id} value={category.id}>
						{category.name}
					</option>
				))}
			</select>

			<select
				value={status}
				onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
				onFocus={warmStatuses}
				onMouseEnter={warmStatuses}
				className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
			>
				<option value="all">All statuses</option>
				<option value="active">Active</option>
				<option value="inactive">Inactive</option>
			</select>

			<select
				value={flag}
				onChange={(event) => onFlagChange(event.target.value as FlagFilter)}
				onFocus={warmFlags}
				onMouseEnter={warmFlags}
				className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
			>
				<option value="all">All flags</option>
				<option value="featured">Featured</option>
				<option value="bestseller">Bestseller</option>
				<option value="in-stock">In stock</option>
				<option value="out-of-stock">Out of stock</option>
			</select>

			<Chip size="sm" variant="soft" color="default">
				{totalCount} {totalCount === 1 ? "product" : "products"}
			</Chip>

			<Button
				size="sm"
				variant="primary"
				onPress={onCreateClick}
				className="gap-1.5"
			>
				<Plus size={15} />
				New Product
			</Button>

			<Button
				size="sm"
				variant="outline"
				isPending={isSeeding}
				isDisabled={isSeeding}
				onPress={onSeedClick}
				className="gap-1.5"
			>
				<DatabaseZap size={15} />
				Seed Catalog
			</Button>
		</div>
	);
}

function ProductImage({ product }: { product: AdminProductListItemType }) {
	if (product.image) {
		return (
			<img
				src={product.image}
				alt={product.name}
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

function ProductBadges({ product }: { product: AdminProductListItemType }) {
	return (
		<div className="flex flex-wrap gap-1.5">
			<Chip
				size="sm"
				variant="soft"
				color={product.isActive ? "success" : "danger"}
			>
				{product.isActive ? "Active" : "Inactive"}
			</Chip>
			{product.isFeatured ? (
				<Chip size="sm" variant="soft" color="accent">
					Featured
				</Chip>
			) : null}
			{product.isBestseller ? (
				<Chip size="sm" variant="soft" color="warning">
					Bestseller
				</Chip>
			) : null}
		</div>
	);
}

function ProductsTable({
	products,
	onView,
	onEdit,
	onDelete,
	onManageVariants,
}: {
	products: AdminProductListItemType[];
	onView: (product: AdminProductListItemType) => void;
	onEdit: (product: AdminProductListItemType) => void;
	onDelete: (product: AdminProductListItemType) => void;
	onManageVariants: (product: AdminProductListItemType) => void;
}) {
	if (products.length === 0) {
		return <PanelState icon={Boxes} title="No products found" />;
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-border">
						<th className="px-2 py-3 text-left text-xs font-semibold text-muted">
							Product
						</th>
						<th className="px-2 py-3 text-left text-xs font-semibold text-muted">
							Default variant
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
					{products.map((product) => (
						<tr
							key={product.id}
							onClick={() => onView(product)}
							className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-default/50"
						>
							<td className="px-2 py-3">
								<div className="flex items-center gap-3">
									<ProductImage product={product} />
									<div className="min-w-0">
										<p className="truncate font-medium text-foreground">
											{product.name}
										</p>
										<p className="text-xs text-muted">
											{product.brand} / {product.slug}
										</p>
									</div>
								</div>
							</td>
							<td className="px-2 py-3">
								<div>
									<p className="font-medium text-foreground">
										{formatCurrency(product.price)}
									</p>
									<p className="text-xs text-muted">
										{product.sku ?? "No default variant"}
									</p>
								</div>
							</td>
							<td className="px-2 py-3">
								<Chip
									size="sm"
									variant="soft"
									color={
										(product.stockQuantity ?? 0) > 0 ? "success" : "danger"
									}
								>
									{product.stockQuantity ?? 0}
								</Chip>
							</td>
							<td className="px-2 py-3">
								<ProductBadges product={product} />
							</td>
							<td className="whitespace-nowrap px-2 py-3 text-muted">
								{formatDate(product.updatedAt)}
							</td>
							<td className="px-2 py-3">
								<ProductActions
									product={product}
									onEdit={onEdit}
									onDelete={onDelete}
									onManageVariants={onManageVariants}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function ProductsList({
	products,
	onView,
	onEdit,
	onDelete,
	onManageVariants,
}: {
	products: AdminProductListItemType[];
	onView: (product: AdminProductListItemType) => void;
	onEdit: (product: AdminProductListItemType) => void;
	onDelete: (product: AdminProductListItemType) => void;
	onManageVariants: (product: AdminProductListItemType) => void;
}) {
	if (products.length === 0) {
		return <PanelState icon={Boxes} title="No products found" />;
	}

	return (
		<div className="divide-y divide-border">
			{products.map((product) => (
				<div
					key={product.id}
					className="flex cursor-pointer flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
				>
					<button
						type="button"
						onClick={() => onView(product)}
						className="flex min-w-0 flex-1 items-center gap-3 text-left"
					>
						<ProductImage product={product} />
						<div className="min-w-0">
							<p className="truncate text-sm font-semibold text-foreground">
								{product.name}
							</p>
							<p className="text-xs text-muted">{product.brand}</p>
							<div className="mt-2">
								<ProductBadges product={product} />
							</div>
						</div>
					</button>
					<div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
						<div className="text-right">
							<p className="text-sm font-semibold text-foreground">
								{formatCurrency(product.price)}
							</p>
							<p className="text-xs text-muted">
								Stock {product.stockQuantity ?? 0}
							</p>
						</div>
						<ProductActions
							product={product}
							onEdit={onEdit}
							onDelete={onDelete}
							onManageVariants={onManageVariants}
						/>
					</div>
				</div>
			))}
		</div>
	);
}

function ProductsCards({
	products,
	onView,
	onEdit,
	onDelete,
	onManageVariants,
}: {
	products: AdminProductListItemType[];
	onView: (product: AdminProductListItemType) => void;
	onEdit: (product: AdminProductListItemType) => void;
	onDelete: (product: AdminProductListItemType) => void;
	onManageVariants: (product: AdminProductListItemType) => void;
}) {
	if (products.length === 0) {
		return <PanelState icon={Boxes} title="No products found" />;
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{products.map((product) => (
				<div
					key={product.id}
					className="cursor-pointer rounded-2xl border border-border bg-default/30 p-4"
				>
					<button
						type="button"
						onClick={() => onView(product)}
						className="block w-full text-left"
					>
						<div className="flex items-start gap-3">
							<ProductImage product={product} />
							<div className="min-w-0">
								<p className="truncate text-sm font-semibold text-foreground">
									{product.name}
								</p>
								<p className="text-xs text-muted">{product.brand}</p>
							</div>
						</div>

						<div className="mt-4 flex items-center justify-between">
							<div>
								<p className="text-sm font-bold text-foreground">
									{formatCurrency(product.price)}
								</p>
								<p className="text-xs text-muted">
									{product.stockQuantity ?? 0} in stock
								</p>
							</div>
							<div className="flex items-center gap-1 text-xs text-muted">
								<Star size={13} className="text-warning" />
								{product.ratingAvg.toFixed(1)}
							</div>
						</div>

						<div className="mt-4">
							<ProductBadges product={product} />
						</div>
					</button>

					<div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
						<span>Updated {formatDate(product.updatedAt)}</span>
						<ProductActions
							product={product}
							onEdit={onEdit}
							onDelete={onDelete}
							onManageVariants={onManageVariants}
						/>
					</div>
				</div>
			))}
		</div>
	);
}

function ProductActions({
	product,
	onEdit,
	onDelete,
	onManageVariants,
}: {
	product: AdminProductListItemType;
	onEdit: (product: AdminProductListItemType) => void;
	onDelete: (product: AdminProductListItemType) => void;
	onManageVariants: (product: AdminProductListItemType) => void;
}) {
	return (
		<div className="flex items-center justify-end gap-1">
			<Button
				isIconOnly
				size="sm"
				variant="ghost"
				onClick={(event) => event.stopPropagation()}
				onPress={() => onManageVariants(product)}
				aria-label={`Manage variants for ${product.name}`}
				className="text-muted hover:text-foreground"
			>
				<Settings2 size={15} />
			</Button>
			<Button
				isIconOnly
				size="sm"
				variant="ghost"
				onClick={(event) => event.stopPropagation()}
				onPress={() => onEdit(product)}
				aria-label={`Edit ${product.name}`}
				className="text-muted hover:text-foreground"
			>
				<Pencil size={15} />
			</Button>
			<Button
				isIconOnly
				size="sm"
				variant="ghost"
				onClick={(event) => event.stopPropagation()}
				onPress={() => onDelete(product)}
				aria-label={`Delete ${product.name}`}
				className="text-muted hover:text-danger"
			>
				<Trash2 size={15} />
			</Button>
		</div>
	);
}

function ProductsPagination({
	currentPage,
	totalPages,
	totalItems,
	limit,
	onPageChange,
	onPrefetchPage,
}: {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	limit: number;
	onPageChange: (page: number) => void;
	onPrefetchPage: (page: number) => void;
}) {
	if (totalItems === 0) return null;

	const startItem = (currentPage - 1) * limit + 1;
	const endItem = Math.min(currentPage * limit, totalItems);

	return (
		<div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
			<p className="text-sm text-muted">
				Showing {startItem}-{endItem} of {totalItems} products
			</p>
			<div className="flex items-center gap-2">
				<Button
					size="sm"
					variant="outline"
					isDisabled={currentPage === 1}
					onPress={() => onPageChange(currentPage - 1)}
					onFocus={() => currentPage > 1 && onPrefetchPage(currentPage - 1)}
					onMouseEnter={() =>
						currentPage > 1 && onPrefetchPage(currentPage - 1)
					}
				>
					Previous
				</Button>
				<Chip size="sm" variant="soft" color="default">
					Page {currentPage} of {totalPages}
				</Chip>
				<Button
					size="sm"
					variant="outline"
					isDisabled={currentPage >= totalPages}
					onPress={() => onPageChange(currentPage + 1)}
					onFocus={() =>
						currentPage < totalPages && onPrefetchPage(currentPage + 1)
					}
					onMouseEnter={() =>
						currentPage < totalPages && onPrefetchPage(currentPage + 1)
					}
				>
					Next
				</Button>
			</div>
		</div>
	);
}

function ProductFormModal({
	isOpen,
	onClose,
	product = null,
	categories,
	isLoadingCategories,
	isCategoriesError,
}: {
	isOpen: boolean;
	onClose: () => void;
	product?: AdminProductListItemType | null;
	categories: CategoryWithCount[];
	isLoadingCategories: boolean;
	isCategoriesError: boolean;
}) {
	const isEdit = product !== null;

	// Hooks must be at the top level, never inside callbacks
	const createProduct = useCreateProduct();
	const updateProduct = useUpdateProduct();
	const productDetailQuery = useQuery({
		...getProductQueryOptions({ productId: product?.id ?? "" }),
		enabled: isOpen && isEdit && Boolean(product?.id),
	});
	const productDetail = productDetailQuery.data?.data.product ?? null;
	const isProductDetailLoading = isEdit && productDetailQuery.isLoading;
	const isProductDetailError = isEdit && productDetailQuery.isError;
	const isProductMissing =
		isEdit &&
		!isProductDetailLoading &&
		!isProductDetailError &&
		productDetail === null;
	const canShowFields =
		!isLoadingCategories &&
		!isCategoriesError &&
		categories.length > 0 &&
		!isProductDetailLoading &&
		!isProductDetailError &&
		!isProductMissing;

	const form = useForm({
		defaultValues: fallbackProductForm,
		validators: {
			onSubmit: productFormSchema,
		},
		onSubmit: async ({ value }) => {
			if (!canShowFields) return;
			const payload = {
				categoryId: value.categoryId,
				name: value.name.trim(),
				brand: value.brand.trim(),
				slug: value.slug.trim(),
				shortDescription: nullableText(value.shortDescription),
				description: value.description,
				warrantyInfo: nullableText(value.warrantyInfo),
				image: nullableText(value.image),
				isFeatured: value.isFeatured,
				isBestseller: value.isBestseller,
				isActive: value.isActive,
			};

			if (isEdit) {
				await updateProduct.mutateAsync({
					productId: product.id,
					...payload,
				});
			} else {
				await createProduct.mutateAsync(payload);
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

		if (!canShowFields) {
			return;
		}

		const nextValues = isEdit
			? productDetailToFormValues(productDetail, categories)
			: emptyProductForm(categories);
		for (const key of Object.keys(nextValues) as (keyof ProductFormValues)[]) {
			setFieldValue(key, nextValues[key]);
		}
	}, [
		isOpen,
		isEdit,
		productDetail,
		categories,
		canShowFields,
		setFieldValue,
		reset,
	]);

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
									{isEdit ? "Edit Product" : "New Product"}
								</Modal.Heading>
								<Modal.CloseTrigger className="text-muted hover:text-foreground">
									<X size={18} />
								</Modal.CloseTrigger>
							</Modal.Header>

							<Modal.Body className="max-h-[70vh] space-y-4 overflow-y-auto">
								{isLoadingCategories || isProductDetailLoading ? (
									<div className="space-y-3">
										<Skeleton className="h-16 rounded-xl" />
										<Skeleton className="h-24 rounded-xl" />
										<Skeleton className="h-32 rounded-xl" />
									</div>
								) : null}

								{isCategoriesError ? (
									<FormNotice
										title="Categories failed to load"
										description="Product creation needs real categories from the database. Refresh and try again."
									/>
								) : null}

								{!isLoadingCategories &&
								!isCategoriesError &&
								categories.length === 0 ? (
									<FormNotice
										title="Create categories first"
										description="Products must belong to a real category. Add categories from the Categories page, then come back here."
									/>
								) : null}

								{isProductDetailError ? (
									<FormNotice
										title="Product failed to load"
										description="The edit form needs the full product record before saving changes."
									/>
								) : null}

								{isProductMissing ? (
									<FormNotice
										title="Product not found"
										description="This product no longer exists or could not be loaded."
									/>
								) : null}

								{canShowFields ? (
									<>
										<Field name="categoryId">
											{(field) => (
												<SelectField
													label="Category"
													value={field.state.value}
													onChange={(value) => field.handleChange(value)}
													errorText={getAdminFieldError(field, form)}
												>
													<option value="">Select category</option>
													{categories.map((category) => (
														<option key={category.id} value={category.id}>
															{category.name}
														</option>
													))}
												</SelectField>
											)}
										</Field>

										<div className="grid gap-4 md:grid-cols-2">
											<Field name="name">
												{(field) => (
													<InputField
														label="Name"
														placeholder='e.g. MacBook Pro 14"'
														value={field.state.value}
														onChange={(value) => {
															field.handleChange(value);
															setFieldValue("slug", toSlug(value));
														}}
														onBlur={field.handleBlur}
														errorText={getAdminFieldError(field, form)}
													/>
												)}
											</Field>

											<Field name="brand">
												{(field) => (
													<InputField
														label="Brand"
														placeholder="e.g. Apple"
														value={field.state.value}
														onChange={(value) => field.handleChange(value)}
														onBlur={field.handleBlur}
														errorText={getAdminFieldError(field, form)}
													/>
												)}
											</Field>
										</div>

										<Field name="slug">
											{(field) => (
												<InputField
													label="Slug"
													placeholder="e.g. macbook-pro-14"
													value={field.state.value}
													onChange={(value) =>
														field.handleChange(toSlug(value))
													}
													onBlur={field.handleBlur}
													errorText={getAdminFieldError(field, form)}
												/>
											)}
										</Field>

										<Field name="shortDescription">
											{(field) => (
												<TextareaField
													label="Short description"
													value={field.state.value}
													onChange={(value) => field.handleChange(value)}
													placeholder="Short summary shown in product cards."
													errorText={getAdminFieldError(field, form)}
												/>
											)}
										</Field>

										<Field name="description">
											{(field) => (
												<RichTextEditor
													label="Description"
													value={field.state.value}
													onChange={(value) => field.handleChange(value)}
													placeholder="Full product description."
													errorText={getAdminFieldError(field, form)}
												/>
											)}
										</Field>

										<Field name="warrantyInfo">
											{(field) => (
												<TextareaField
													label="Warranty info"
													value={field.state.value}
													onChange={(value) => field.handleChange(value)}
													placeholder="Optional warranty details."
													errorText={getAdminFieldError(field, form)}
												/>
											)}
										</Field>

										<Field name="image">
											{(field) => (
												<div className="space-y-2">
													<InputField
														label="Image URL"
														placeholder="Upload an image or paste a URL."
														value={field.state.value}
														onChange={(value) => field.handleChange(value)}
														onBlur={field.handleBlur}
														errorText={getAdminFieldError(field, form)}
													/>
													<AdminImageUploader
														value={field.state.value}
														label="Product image"
														helperText="Preview appears before upload. The image URL is saved after upload finishes."
														onUploaded={(imageUrl) =>
															field.handleChange(imageUrl)
														}
													/>
												</div>
											)}
										</Field>

										<div className="grid gap-3 md:grid-cols-3">
											<Field name="isActive">
												{(field) => (
													<CheckboxField
														label="Active"
														checked={field.state.value}
														onChange={(value) => field.handleChange(value)}
														icon={CheckCircle2}
													/>
												)}
											</Field>
											<Field name="isFeatured">
												{(field) => (
													<CheckboxField
														label="Featured"
														checked={field.state.value}
														onChange={(value) => field.handleChange(value)}
														icon={Star}
													/>
												)}
											</Field>
											<Field name="isBestseller">
												{(field) => (
													<CheckboxField
														label="Bestseller"
														checked={field.state.value}
														onChange={(value) => field.handleChange(value)}
														icon={BadgeDollarSign}
													/>
												)}
											</Field>
										</div>
									</>
								) : null}
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
												isDisabled={isSubmitting || !canShowFields}
											>
												{isEdit ? "Save changes" : "Create Product"}
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

function ProductDetailSheet({
	product,
	onClose,
	onEdit,
	onDelete,
	onManageVariants,
}: {
	product: AdminProductListItemType | null;
	onClose: () => void;
	onEdit: (product: AdminProductListItemType) => void;
	onDelete: (product: AdminProductListItemType) => void;
	onManageVariants: (product: AdminProductListItemType) => void;
}) {
	const detailQuery = useQuery({
		...getProductQueryOptions({ productId: product?.id ?? "" }),
		enabled: product !== null,
	});
	const detail = detailQuery.data?.data.product ?? null;
	const image = detail?.image ?? product?.image ?? null;
	const variants = detail?.variants ?? [];
	const defaultVariant = variants.find((variant) => variant.isDefault) ?? null;

	return (
		<AdminDetailSheet
			isOpen={product !== null}
			onClose={onClose}
			title={product?.name ?? "Product"}
			subtitle={product ? `${product.brand} / ${product.slug}` : undefined}
			badge={product ? <ProductBadges product={product} /> : null}
			footer={
				product ? (
					<>
						<Button
							size="sm"
							variant="outline"
							onPress={() => onManageVariants(product)}
						>
							Manage variants
						</Button>
						<Button size="sm" variant="outline" onPress={() => onEdit(product)}>
							Edit
						</Button>
						<Button
							size="sm"
							variant="danger"
							onPress={() => onDelete(product)}
						>
							Delete
						</Button>
					</>
				) : null
			}
		>
			{detailQuery.isLoading ? (
				<div className="space-y-4">
					<Skeleton className="h-40 rounded-2xl" />
					<Skeleton className="h-28 rounded-2xl" />
					<Skeleton className="h-40 rounded-2xl" />
				</div>
			) : null}

			{detailQuery.isError ? (
				<FormNotice
					title="Product details failed to load"
					description="The sheet can still show the row summary, but the full product record is not available."
				/>
			) : null}

			{product && !detailQuery.isLoading ? (
				<div className="space-y-5">
					{image ? (
						<img
							src={image}
							alt={product.name}
							className="h-48 w-full rounded-2xl border border-border object-cover"
						/>
					) : null}

					<DetailSection title="Product">
						<DetailRow label="ID" value={product.id} mono />
						<DetailRow label="Name" value={detail?.name ?? product.name} />
						<DetailRow label="Brand" value={detail?.brand ?? product.brand} />
						<DetailRow label="Slug" value={detail?.slug ?? product.slug} mono />
						<DetailRow
							label="Category"
							value={detail?.category.name ?? "Full detail unavailable"}
						/>
						<DetailRow
							label="Created"
							value={
								detail
									? formatDate(detail.createdAt)
									: "Full detail unavailable"
							}
						/>
						<DetailRow
							label="Updated"
							value={formatDate(detail?.updatedAt ?? product.updatedAt)}
						/>
					</DetailSection>

					<DetailSection title="Content">
						<DetailRow
							label="Short"
							value={detail?.shortDescription ?? "No short description"}
						/>
						<DetailRow
							label="Description"
							value={
								detail
									? stripHtml(detail.description) || "No description"
									: "Full detail unavailable"
							}
						/>
						<DetailRow
							label="Warranty"
							value={detail?.warrantyInfo ?? "No warranty info"}
						/>
					</DetailSection>

					<DetailSection title="Variants">
						<DetailRow label="Variant count" value={variants.length} />
						<DetailRow
							label="Default SKU"
							value={defaultVariant?.sku ?? product.sku ?? "No default variant"}
							mono
						/>
						<DetailRow
							label="Default price"
							value={formatCurrency(defaultVariant?.price ?? product.price)}
						/>
						<DetailRow
							label="Stock"
							value={
								defaultVariant?.stockQuantity ?? product.stockQuantity ?? 0
							}
						/>
					</DetailSection>

					<DetailSection title="Signals">
						<DetailRow label="Reviews" value={product.reviewsCount} />
						<DetailRow label="Rating" value={product.ratingAvg.toFixed(1)} />
						<DetailRow
							label="Flags"
							value={
								<div className="flex flex-wrap gap-1.5">
									<ProductBadges product={product} />
								</div>
							}
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

function DeleteProductDialog({
	product,
	onClose,
}: {
	product: AdminProductListItemType | null;
	onClose: () => void;
}) {
	// Hook must be at the top level, never inside a handler
	const deleteProduct = useDeleteProduct({ onSuccess: onClose });

	function handleDelete() {
		if (!product) return;
		deleteProduct.mutate({ productId: product.id });
	}

	return (
		<AlertDialog.Root
			isOpen={product !== null}
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
									Delete "{product?.name}"?
								</AlertDialog.Heading>
							</div>
						</AlertDialog.Header>

						<AlertDialog.Body>
							<p className="text-sm text-muted">
								Deleting a product also deletes its variants (cascade delete).
							</p>
						</AlertDialog.Body>

						<AlertDialog.Footer className="gap-2">
							<Button variant="outline" size="sm" onPress={onClose}>
								Cancel
							</Button>
							<Button
								variant="danger"
								size="sm"
								onPress={handleDelete}
								isPending={deleteProduct.isPending}
								isDisabled={deleteProduct.isPending}
							>
								Delete Product
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

function TextareaField({
	label,
	value,
	onChange,
	placeholder,
	errorText,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder: string;
	errorText?: string;
}) {
	return (
		<label className="flex flex-col gap-1.5">
			<span className="text-sm font-medium text-foreground">{label}</span>
			<textarea
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				rows={3}
				className="w-full resize-y rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
			/>
			{errorText ? (
				<span className="text-xs text-danger">{errorText}</span>
			) : null}
		</label>
	);
}

function CheckboxField({
	label,
	checked,
	onChange,
	icon: Icon,
}: {
	label: string;
	checked: boolean;
	onChange: (value: boolean) => void;
	icon: LucideIcon;
}) {
	return (
		<label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-default/30 p-3">
			<input
				type="checkbox"
				checked={checked}
				onChange={(event) => onChange(event.target.checked)}
				className="size-4 accent-[var(--accent)]"
			/>
			<Icon size={16} className={checked ? "text-accent" : "text-muted"} />
			<span className="text-sm font-medium text-foreground">{label}</span>
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
