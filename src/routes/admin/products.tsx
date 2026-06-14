import { createFileRoute } from "@tanstack/react-router";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { ProductsPage } from "#/components/admin/pages/products/products-page.tsx";
import { listProductsQueryOptions } from "#/queries/products.queries";
import { getProductsSchema } from "#/server/catalog/products/products.schemas";

export const Route = createFileRoute("/admin/products")({
	validateSearch: getProductsSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) =>
		context.queryClient.ensureQueryData(
			listProductsQueryOptions({ data: deps }),
		),
	component: ProductsPage,
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
