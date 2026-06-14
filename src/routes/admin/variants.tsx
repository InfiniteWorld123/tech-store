import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { VariantsPage } from "#/components/admin/pages/variants/variants-page.tsx";
import { getProductQueryOptions } from "#/queries/products.queries";

const variantsSearchSchema = z.object({
	productId: z.string().uuid().optional(),
	search: z.string().optional(),
	stockFilter: z.enum(["all", "in-stock", "empty"]).default("all"),
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(100).default(10),
});

export const Route = createFileRoute("/admin/variants")({
	validateSearch: variantsSearchSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) => {
		if (!deps.productId) return;
		return context.queryClient.ensureQueryData(
			getProductQueryOptions({ productId: deps.productId }),
		);
	},
	component: VariantsPage,
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
