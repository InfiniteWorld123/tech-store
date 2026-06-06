import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "#/components/landing/pages/landing-page";
import { categoriesQueryOptions } from "#/queries/categories.queries";
import {
	bestsellerProductsQueryOptions,
	featuredProductsQueryOptions,
} from "#/queries/products.queries";

// src/routes/index.tsx
export const Route = createFileRoute("/")({
	loader: ({ context: { queryClient } }) =>
		// Use .catch(() => null) so a transient DB error (e.g. Neon cold start)
		// doesn't crash the whole page — the landing page has empty-state UI.
		Promise.all([
			queryClient.ensureQueryData(categoriesQueryOptions).catch(() => null),
			queryClient.ensureQueryData(featuredProductsQueryOptions).catch(() => null),
			queryClient.ensureQueryData(bestsellerProductsQueryOptions).catch(() => null),
		]),
	component: LandingPage,
});
