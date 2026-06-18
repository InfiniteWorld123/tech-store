"use client";

import { Button, Card, Chip, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	ImageOff,
	Search,
	SlidersHorizontal,
	Tags,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "#/components/landing/ui/product-card";
import { Footer } from "#/components/layout/footer";
import { Header } from "#/components/layout/header";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { CategoryIconDisplay } from "#/components/ui/icons/category-icon";
import { WindowedPagination } from "#/components/ui/pagination/windowed-pagination";
import { useDebouncedSearchParam } from "#/hooks/use-debounced-search-param";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { listCategoriesQueryOptions } from "#/queries/categories.queries";
import {
	listColorsQueryOptions,
	listRamsQueryOptions,
	listScreensQueryOptions,
	listStoragesQueryOptions,
} from "#/queries/options.queries";
import { listProductsQueryOptions } from "#/queries/products.queries";
import { Route } from "#/routes/categories/$slug";
import type { GetProductsInputType } from "#/server/catalog/products/products.types";
import {
	ProductFilterDrawer,
	ProductFilterSidebar,
	type ProductFilterValues,
} from "../sections/product-filter-sidebar";

const LIMIT = 12;

const SORT_OPTIONS = [
	{ value: "createdAt:desc", label: "Newest" },
	{ value: "price:asc", label: "Price: Low → High" },
	{ value: "price:desc", label: "Price: High → Low" },
	{ value: "rating:desc", label: "Top Rated" },
	{ value: "reviews:desc", label: "Most Reviewed" },
	{ value: "name:asc", label: "Name A–Z" },
] as const;

const SKELETON_IDS = Array.from({ length: 12 }, (_, i) => `skel-${i}`);

type Props = { slug: string };
type SortBy = NonNullable<GetProductsInputType["sorting"]>["sortBy"];
type SortOrder = NonNullable<GetProductsInputType["sorting"]>["sortOrder"];
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function CategoryDetailPage({ slug }: Props) {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { prefetch } = useQueryIntentPrefetch();
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const {
		page,
		sort,
		colorIds,
		storageIds,
		ramIds,
		screenSizeIds,
		minPrice,
		maxPrice,
		inStock,
		onSale,
		minRating,
	} = search;

	const { data: categoriesData, isLoading: isCategoryLoading } = useQuery(
		listCategoriesQueryOptions({
			searching: { search: slug, searchType: "slug" },
		}),
	);
	const category =
		categoriesData?.data?.items?.find((item) => item.slug === slug) ?? null;
	const isCategoryNotFound = !isCategoryLoading && !category;
	const { data: colorsData } = useQuery(listColorsQueryOptions({}));
	const { data: storagesData } = useQuery(listStoragesQueryOptions({}));
	const { data: ramsData } = useQuery(listRamsQueryOptions({}));
	const { data: screensData } = useQuery(listScreensQueryOptions({}));

	const buildProductsInput = useCallback(
		(nextSearch: typeof search, categoryId?: string): GetProductsInputType => {
			const [sortBy = "createdAt", sortOrder = "desc"] =
				nextSearch.sort.split(":");

			return {
				pagination: { page: nextSearch.page, limit: LIMIT },
				searching: nextSearch.search
					? { search: nextSearch.search, searchType: "name" }
					: undefined,
				filters: categoryId
					? {
							categoryIds: [categoryId],
							colorIds: nextSearch.colorIds,
							storageIds: nextSearch.storageIds,
							ramIds: nextSearch.ramIds,
							screenSizeIds: nextSearch.screenSizeIds,
						}
					: undefined,
				sorting: {
					sortBy: sortBy as SortBy,
					sortOrder: sortOrder as SortOrder,
				},
				ranges: {
					priceRange:
						nextSearch.minPrice !== undefined ||
						nextSearch.maxPrice !== undefined
							? {
									minPrice: nextSearch.minPrice,
									maxPrice: nextSearch.maxPrice,
								}
							: undefined,
					ratingRange:
						nextSearch.minRating !== undefined
							? { minRating: nextSearch.minRating }
							: undefined,
				},
				flags: {
					isActive: true,
					inStock: nextSearch.inStock ? true : undefined,
					isSale: nextSearch.onSale ? true : undefined,
				},
			};
		},
		[],
	);

	const { data: productsData, isLoading: isProductsLoading } = useQuery({
		...listProductsQueryOptions({
			data: buildProductsInput(search, category?.id),
		}),
		enabled: !!category,
	});

	const prefetchProducts = useCallback(
		(nextSearch: typeof search) => {
			if (!category) return;
			prefetch(
				listProductsQueryOptions({
					data: buildProductsInput(nextSearch, category.id),
				}),
			);
		},
		[buildProductsInput, category, prefetch],
	);

	const setSearch = useCallback(
		(partial: Partial<typeof search>) =>
			navigate({ search: (prev) => ({ ...prev, ...partial }) }),
		[navigate],
	);

	const commitSearch = useCallback(
		(value: string | undefined) => {
			navigate({
				search: (prev) => ({
					...prev,
					search: value,
					page: 1,
				}),
			});
		},
		[navigate],
	);
	const { inputValue, setInputValue } = useDebouncedSearchParam({
		committedValue: search.search,
		onCommit: commitSearch,
	});

	const prefetchCategories = () => prefetch(listCategoriesQueryOptions({}));

	const setPage = (nextPage: number) => {
		prefetchProducts({ ...search, page: nextPage });
		setSearch({ page: nextPage });
	};

	const prefetchPage = (nextPage: number) => {
		if (nextPage === page) return;
		prefetchProducts({ ...search, page: nextPage });
	};

	const setSort = (nextSort: SortValue) => {
		prefetchProducts({ ...search, sort: nextSort, page: 1 });
		setSearch({ sort: nextSort, page: 1 });
	};

	const warmSortOptions = () => {
		for (const option of SORT_OPTIONS) {
			prefetchProducts({ ...search, sort: option.value, page: 1 });
		}
	};

	const prefetchFilters = (values: ProductFilterValues) => {
		prefetchProducts({ ...search, ...values, page: 1 });
	};

	const setFilters = (values: ProductFilterValues) => {
		setSearch({ ...values, page: 1 });
	};

	const items = productsData?.data?.items ?? [];
	const pagination = productsData?.data?.pagination;
	const categoryName = category?.name ?? slug;
	const isLoading = isCategoryLoading || (!!category && isProductsLoading);
	const filterValues: ProductFilterValues = {
		colorIds,
		storageIds,
		ramIds,
		screenSizeIds,
		minPrice,
		maxPrice,
		inStock,
		onSale,
		minRating,
	};
	const filterOptions = {
		colors: colorsData?.data.items ?? [],
		storages: storagesData?.data.items ?? [],
		rams: ramsData?.data.items ?? [],
		screens: screensData?.data.items ?? [],
	};
	const activeFilterCount =
		colorIds.length +
		storageIds.length +
		ramIds.length +
		screenSizeIds.length +
		(minPrice !== undefined ? 1 : 0) +
		(maxPrice !== undefined ? 1 : 0) +
		(inStock ? 1 : 0) +
		(onSale ? 1 : 0) +
		(minRating !== undefined ? 1 : 0);

	useEffect(() => {
		if (
			!pagination ||
			pagination.total === 0 ||
			page <= pagination.totalPages
		) {
			return;
		}

		navigate({
			replace: true,
			search: (prev) => ({ ...prev, page: pagination.totalPages }),
		});
	}, [navigate, page, pagination]);

	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 pt-20 pb-14 sm:pt-24 sm:pb-20">
				<div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
					<nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted sm:mb-8">
						<LinkAnchor
							to="/categories"
							className="hover:text-foreground transition-colors"
							onFocus={prefetchCategories}
							onMouseEnter={prefetchCategories}
						>
							All categories
						</LinkAnchor>
						<ArrowRight size={14} className="flex-shrink-0" />
						<span className="min-w-0 break-words font-medium text-foreground">
							{categoryName}
						</span>
					</nav>

					{isCategoryNotFound ? (
						<Card className="items-center border-dashed px-4 py-12 text-center sm:px-6 sm:py-16">
							<Tags size={28} className="text-muted" />
							<Card.Header className="items-center">
								<Card.Title className="text-base">
									Category not found
								</Card.Title>
								<Card.Description className="max-w-md">
									This category does not exist or is no longer available.
								</Card.Description>
							</Card.Header>
						</Card>
					) : (
						<>
							<div className="mb-8 flex items-start gap-3 sm:mb-10 sm:items-center sm:gap-4">
								{category ? (
									<CategoryIconDisplay
										icon={category.icon}
										iconColor={category.iconColor}
										iconBg={category.iconBg}
										name={category.name}
										iconSize={24}
										className="h-12 w-12 flex-shrink-0 rounded-2xl sm:h-14 sm:w-14"
									/>
								) : null}
								<div className="min-w-0">
									<h1 className="break-words text-2xl font-bold text-foreground sm:text-4xl">
										{categoryName}
									</h1>
									<div className="flex items-center gap-2 mt-1">
										<Chip size="sm" variant="soft" color="default">
											{pagination?.total ?? "..."} products
										</Chip>
									</div>
								</div>
							</div>

							<div className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-8">
								<div className="hidden lg:block w-52 flex-shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
									<ProductFilterSidebar
										values={filterValues}
										options={filterOptions}
										onChange={setFilters}
										onPrefetchChange={prefetchFilters}
									/>
								</div>

								<div className="min-w-0">
									<div className="mb-6 grid gap-3 md:grid-cols-[minmax(0,24rem)_auto] md:items-center md:justify-between">
										<div className="relative min-w-0">
											<Search
												size={14}
												className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
											/>
											<input
												type="text"
												value={inputValue}
												onChange={(e) => setInputValue(e.target.value)}
												placeholder={`Search ${categoryName}...`}
												className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-border bg-surface text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
											/>
										</div>
										<div className="grid gap-2 md:flex md:items-center md:justify-end md:gap-3">
											<Button
												size="sm"
												variant="outline"
												className="w-full justify-start lg:hidden"
												onPress={() => setIsFilterOpen(true)}
											>
												<SlidersHorizontal size={14} />
												Filters
												{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
											</Button>
											<p className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted md:border-0 md:bg-transparent md:px-0 md:py-0">
												{pagination
													? `${pagination.total} product${pagination.total !== 1 ? "s" : ""}`
													: ""}
											</p>
											<select
												value={sort}
												onChange={(e) => setSort(e.target.value as SortValue)}
												onFocus={warmSortOptions}
												onMouseEnter={warmSortOptions}
												className="w-full appearance-none rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/40 md:w-auto md:pr-8"
											>
												{SORT_OPTIONS.map((opt) => (
													<option key={opt.value} value={opt.value}>
														{opt.label}
													</option>
												))}
											</select>
										</div>
									</div>

									{isLoading ? (
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
											{SKELETON_IDS.map((id) => (
												<Card key={id} className="overflow-hidden">
													<Skeleton className="aspect-square w-full" />
													<Card.Content className="p-4 flex flex-col gap-2">
														<Skeleton className="h-3 w-16 rounded" />
														<Skeleton className="h-4 w-full rounded" />
														<Skeleton className="h-3 w-24 rounded" />
														<Skeleton className="h-4 w-20 rounded" />
													</Card.Content>
												</Card>
											))}
										</div>
									) : items.length > 0 ? (
										<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
											{items.map((product) => (
												<ProductCard key={product.id} product={product} />
											))}
										</div>
									) : (
										<Card className="items-center border-dashed px-4 py-12 text-center sm:px-6 sm:py-16">
											<ImageOff size={28} className="text-muted" />
											<Card.Header className="items-center">
												<Card.Title className="text-base">
													No products found
												</Card.Title>
												<Card.Description className="max-w-md">
													There are no matching products in this category yet.
												</Card.Description>
											</Card.Header>
										</Card>
									)}

									{pagination ? (
										<WindowedPagination
											className="mt-10 pt-6 border-t border-border"
											currentPage={page}
											totalPages={pagination.totalPages}
											totalItems={pagination.total}
											limit={LIMIT}
											itemLabel="product"
											onPageChange={setPage}
											onPrefetchPage={prefetchPage}
										/>
									) : null}
								</div>
							</div>
							<ProductFilterDrawer
								isOpen={isFilterOpen}
								onClose={() => setIsFilterOpen(false)}
								values={filterValues}
								options={filterOptions}
								onChange={setFilters}
								onPrefetchChange={prefetchFilters}
							/>
						</>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
}
