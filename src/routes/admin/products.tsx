import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "#/components/admin/pages/products-page";
import { listProductsQueryOptions } from "#/queries/products.queries";
import {
	mapProductsSearchToInput,
	productsSearchSchema,
} from "#/queries/products-search";

function ProductsRouteComponent() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<ProductsPage
			search={search}
			queryInput={mapProductsSearchToInput(search)}
			onFilterApply={(formData) => {
				navigate({
					search: (prev) => ({
						...prev,

						status: String(
							formData.get("status") ?? "all",
						) as typeof prev.status,

						isFeatured: formData.has("isFeatured") ? true : undefined,
						isBestseller: formData.has("isBestseller") ? true : undefined,
						isSale: formData.has("isSale") ? true : undefined,
						inStock: formData.has("inStock") ? true : undefined,
						hasReviews: formData.has("hasReviews") ? true : undefined,

						categoryIds: formData.getAll("categoryIds").map(String),

						minPrice: getOptionalNumber(formData, "minPrice"),
						maxPrice: getOptionalNumber(formData, "maxPrice"),
						minRating: getOptionalNumber(formData, "minRating"),
						maxRating: getOptionalNumber(formData, "maxRating"),
						minStock: getOptionalNumber(formData, "minStock"),
						maxStock: getOptionalNumber(formData, "maxStock"),

						page: 1,
					}),
				});
			}}
			onFilterReset={() => {
				navigate({
					search: (prev) => ({
						search: prev.search,
						searchType: prev.searchType,
						sort: prev.sort,
						page: 1,
						limit: prev.limit,
					}),
				});
			}}
		/>
	);
}

function getOptionalNumber(formData: FormData, name: string) {
	const value = String(formData.get(name) ?? "").trim();

	return value === "" ? undefined : Number(value);
}

export const Route = createFileRoute("/admin/products")({
	validateSearch: productsSearchSchema,
	loaderDeps: ({ search }) => search,
	component: ProductsRouteComponent,
	loader: ({ context, deps }) => {
		return context.queryClient.ensureQueryData(
			listProductsQueryOptions({ data: mapProductsSearchToInput(deps) }),
		);
	},
});
