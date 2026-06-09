import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "#/components/landing/pages/landing-page";
import { useCategoriesQueryOptions } from "#/hooks/categories.hooks";
import {
	useBestsellerProductsQueryOptions,
	useFeaturedProductsQueryOptions,
} from "#/hooks/products.hooks";

// src/routes/index.tsx
export const Route = createFileRoute("/")({
	loader: ({ context: { queryClient } }) =>
		// Use .catch(() => null) so a transient DB error (e.g. Neon cold start)
		// doesn't crash the whole page — the landing page has empty-state UI.
		Promise.all([
			queryClient.ensureQueryData(useCategoriesQueryOptions).catch(() => null),
			queryClient.ensureQueryData(useFeaturedProductsQueryOptions).catch(() => null),
			queryClient.ensureQueryData(useBestsellerProductsQueryOptions).catch(() => null),
		]),
	component: LandingPage,
});
