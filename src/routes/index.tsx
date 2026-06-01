import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "#/components/landing/pages/landing-page";
import { categoriesQueryOptions } from "#/queries/categories.queries";
import { bestsellerProductsQueryOptions, featuredProductsQueryOptions } from "#/queries/products.queries";

// src/routes/index.tsx
export const Route = createFileRoute("/")({
    loader: ({ context: { queryClient } }) =>
        Promise.all([
            queryClient.ensureQueryData(categoriesQueryOptions),
            queryClient.ensureQueryData(featuredProductsQueryOptions),
            queryClient.ensureQueryData(bestsellerProductsQueryOptions),
        ]),
    component: LandingPage,
});
