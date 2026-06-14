import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { useDebouncedSearchParam } from "#/hooks/use-debounced-search-param";
import { useDebouncedValue } from "#/hooks/use-debounced-value";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import {
	getProductQueryOptions,
	listProductsQueryOptions,
} from "#/queries/products.queries";
import { Route } from "#/routes/admin/variants";
import type { AdminProductListItemType } from "#/server/catalog/products/products.types";
import type { AdminVariantType } from "#/server/catalog/variants/variants.types";
import type { StockFilter } from "./variants.types";

export type { AdminProductListItemType, AdminVariantType, StockFilter };

export function useVariantsPage() {
	const searchParams = Route.useSearch();
	const navigate = useNavigate({ from: "/admin/variants" });
	const { prefetch } = useQueryIntentPrefetch();

	const [createOpen, setCreateOpen] = useState(false);
	const [editTarget, setEditTarget] = useState<AdminVariantType | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<AdminVariantType | null>(
		null,
	);
	const [productSearch, setProductSearch] = useState("");
	const debouncedProductSearch = useDebouncedValue(productSearch);
	const trimmedProductSearch = debouncedProductSearch.trim();

	const { data: productsData, isLoading: isLoadingProducts } = useQuery(
		listProductsQueryOptions({
			data: {
				searching: trimmedProductSearch
					? { search: trimmedProductSearch, searchType: "all" }
					: undefined,
				pagination: { page: 1, limit: 12 },
			},
		}),
	);
	const productOptions: AdminProductListItemType[] =
		productsData?.data.items ?? [];

	const {
		data: productDetailData,
		isLoading,
		isError,
	} = useQuery({
		...getProductQueryOptions({ productId: searchParams.productId ?? "" }),
		enabled: !!searchParams.productId,
	});
	const selectedProduct = productDetailData?.data.product ?? null;
	const allVariants: AdminVariantType[] = selectedProduct?.variants ?? [];

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
	const { inputValue: search, setInputValue: setSearch } =
		useDebouncedSearchParam({
			committedValue: searchParams.search,
			onCommit: commitSearch,
		});
	const committedSearch = searchParams.search ?? "";
	const stockFilter = searchParams.stockFilter;
	const currentPage = searchParams.page;
	const pageLimit = searchParams.limit;

	const filteredVariants = useMemo(() => {
		const q = committedSearch.trim().toLowerCase();
		return allVariants.filter((variant) => {
			const matchesSearch = !q || variant.sku.toLowerCase().includes(q);
			const matchesStock =
				stockFilter === "all" ||
				(stockFilter === "in-stock" && variant.stockQuantity > 0) ||
				(stockFilter === "empty" && variant.stockQuantity === 0);
			return matchesSearch && matchesStock;
		});
	}, [allVariants, committedSearch, stockFilter]);

	const pagination = useMemo(() => {
		const total = filteredVariants.length;
		const totalPages = Math.max(1, Math.ceil(total / pageLimit));
		const safePage = Math.min(currentPage, totalPages);
		const start = (safePage - 1) * pageLimit;
		return {
			page: safePage,
			limit: pageLimit,
			total,
			totalPages,
			items: filteredVariants.slice(start, start + pageLimit),
		};
	}, [filteredVariants, currentPage, pageLimit]);

	function onProductChange(productId: string) {
		if (productId) {
			prefetch(getProductQueryOptions({ productId }));
		}
		navigate({
			search: (prev) => ({
				...prev,
				productId: productId || undefined,
				page: 1,
				search: undefined,
			}),
		});
	}

	function onProductSearchChange(value: string) {
		setProductSearch(value);
	}

	function onSearchChange(value: string) {
		setSearch(value);
	}

	function onStockFilterChange(value: StockFilter) {
		navigate({
			search: (prev) => ({ ...prev, stockFilter: value, page: 1 }),
		});
	}

	function onPrefetchProduct(productId: string) {
		if (!productId || productId === searchParams.productId) return;
		prefetch(getProductQueryOptions({ productId }));
	}

	function onPrefetchStockFilter(_value: StockFilter) {
		void _value;
		// Variants are filtered from the already-loaded product detail.
	}

	function onPageChange(page: number) {
		navigate({ search: (prev) => ({ ...prev, page }) });
	}

	return {
		productOptions,
		productSearch,
		isLoadingProducts,
		selectedProductId: searchParams.productId ?? "",
		selectedProduct,
		onProductChange,
		onProductSearchChange,
		onPrefetchProduct,
		variants: pagination.items,
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
	};
}
