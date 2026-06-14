import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useDebouncedSearchParam } from "#/hooks/use-debounced-search-param";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { listProductsQueryOptions } from "#/queries/products.queries";
import { Route } from "#/routes/admin/products";
import type {
	AdminProductListItemType,
	GetProductsInputType,
} from "#/server/catalog/products/products.types";
import type { FlagFilter, StatusFilter } from "./products.types";

export type { AdminProductListItemType, FlagFilter, StatusFilter };

export function useProductsPage() {
	const searchParams = Route.useSearch();
	const navigate = useNavigate({ from: "/admin/products" });
	const { prefetch } = useQueryIntentPrefetch();

	const [createOpen, setCreateOpen] = useState(false);
	const [editTarget, setEditTarget] = useState<AdminProductListItemType | null>(
		null,
	);
	const [deleteTarget, setDeleteTarget] =
		useState<AdminProductListItemType | null>(null);
	const [selectedVariantProductId, setSelectedVariantProductId] = useState<
		string | null
	>(null);

	const { data, isLoading, isError } = useQuery(
		listProductsQueryOptions({ data: searchParams }),
	);

	const items = data?.data.items ?? [];
	const pagination = data?.data.pagination ?? null;
	const selectedVariantProduct =
		items.find((p) => p.id === selectedVariantProductId) ?? null;

	const commitSearch = useCallback(
		(value: string | undefined) => {
			navigate({
				search: (prev) => ({
					...prev,
					searching: value ? { search: value } : undefined,
					pagination: { ...prev.pagination, page: 1 },
				}),
			});
		},
		[navigate],
	);
	const {
		inputValue: search,
		setInputValue: onSearchChange,
		debouncedValue: debouncedSearch,
		committedValue: committedSearch,
	} = useDebouncedSearchParam({
		committedValue: searchParams.searching?.search,
		onCommit: commitSearch,
	});

	const prefetchProducts = useCallback(
		(data: GetProductsInputType) =>
			prefetch(listProductsQueryOptions({ data })),
		[prefetch],
	);

	const withCategory = useCallback(
		(value: string): GetProductsInputType => ({
			...searchParams,
			filters: {
				categoryIds: value ? [value] : [],
				colorIds: searchParams.filters?.colorIds ?? [],
				storageIds: searchParams.filters?.storageIds ?? [],
				ramIds: searchParams.filters?.ramIds ?? [],
				screenSizeIds: searchParams.filters?.screenSizeIds ?? [],
			},
			pagination: { ...searchParams.pagination, page: 1 },
		}),
		[searchParams],
	);

	const withStatus = useCallback(
		(value: StatusFilter): GetProductsInputType => ({
			...searchParams,
			flags: {
				...searchParams.flags,
				isActive: value === "all" ? undefined : value === "active",
			},
			pagination: { ...searchParams.pagination, page: 1 },
		}),
		[searchParams],
	);

	const withFlag = useCallback(
		(value: FlagFilter): GetProductsInputType => ({
			...searchParams,
			flags: {
				isActive: searchParams.flags?.isActive,
				isFeatured: value === "featured" ? true : undefined,
				isBestseller: value === "bestseller" ? true : undefined,
				inStock:
					value === "in-stock"
						? true
						: value === "out-of-stock"
							? false
							: undefined,
			},
			pagination: { ...searchParams.pagination, page: 1 },
		}),
		[searchParams],
	);

	// Derive flat filter values from URL search params
	const categoryId = searchParams.filters?.categoryIds[0] ?? "";

	const status: StatusFilter =
		searchParams.flags?.isActive === undefined
			? "all"
			: searchParams.flags.isActive
				? "active"
				: "inactive";

	const flag: FlagFilter = (() => {
		const f = searchParams.flags;
		if (f?.isFeatured === true) return "featured";
		if (f?.isBestseller === true) return "bestseller";
		if (f?.inStock === true) return "in-stock";
		if (f?.inStock === false) return "out-of-stock";
		return "all";
	})();

	function onCategoryChange(value: string) {
		prefetchProducts(withCategory(value));
		navigate({
			search: (prev) => ({
				...prev,
				filters: {
					categoryIds: value ? [value] : [],
					colorIds: prev.filters?.colorIds ?? [],
					storageIds: prev.filters?.storageIds ?? [],
					ramIds: prev.filters?.ramIds ?? [],
					screenSizeIds: prev.filters?.screenSizeIds ?? [],
				},
				pagination: { ...prev.pagination, page: 1 },
			}),
		});
	}

	function onStatusChange(value: StatusFilter) {
		prefetchProducts(withStatus(value));
		navigate({
			search: (prev) => ({
				...prev,
				flags: {
					...prev.flags,
					isActive: value === "all" ? undefined : value === "active",
				},
				pagination: { ...prev.pagination, page: 1 },
			}),
		});
	}

	function onFlagChange(value: FlagFilter) {
		prefetchProducts(withFlag(value));
		navigate({
			search: (prev) => ({
				...prev,
				flags: {
					isActive: prev.flags?.isActive,
					isFeatured: value === "featured" ? true : undefined,
					isBestseller: value === "bestseller" ? true : undefined,
					inStock:
						value === "in-stock"
							? true
							: value === "out-of-stock"
								? false
								: undefined,
				},
				pagination: { ...prev.pagination, page: 1 },
			}),
		});
	}

	function onPageChange(page: number) {
		prefetchProducts({
			...searchParams,
			pagination: { ...searchParams.pagination, page },
		});
		navigate({
			search: (prev) => ({
				...prev,
				pagination: { ...prev.pagination, page },
			}),
		});
	}

	const onPrefetchPage = (page: number) => {
		if (page === searchParams.pagination.page) return;
		prefetchProducts({
			...searchParams,
			pagination: { ...searchParams.pagination, page },
		});
	};

	const onPrefetchCategory = (value: string) => {
		if (value === categoryId) return;
		prefetchProducts(withCategory(value));
	};

	const onPrefetchStatus = (value: StatusFilter) => {
		if (value === status) return;
		prefetchProducts(withStatus(value));
	};

	const onPrefetchFlag = (value: FlagFilter) => {
		if (value === flag) return;
		prefetchProducts(withFlag(value));
	};

	function handleManageVariants(product: AdminProductListItemType) {
		navigate({
			to: "/admin/variants",
			search: {
				productId: product.id,
				stockFilter: "all",
				page: 1,
				limit: 10,
			},
		});
	}

	return {
		items,
		pagination,
		isLoading,
		isError,
		search,
		categoryId,
		status,
		flag,
		debouncedSearch,
		committedSearch,
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
		selectedVariantProduct,
		clearVariantProduct: () => setSelectedVariantProductId(null),
		handleManageVariants,
	};
}
