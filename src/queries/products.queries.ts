import { getProductsAction } from "#/server/catalog/products/products.actions";
import { queryOptions } from "@tanstack/react-query";

// src/queries/categories.queries.ts
export const featuredProductsQueryOptions = queryOptions({
    queryKey: ["products", "featured"],
    queryFn: () => getProductsAction({
        data: {
            pagination: { limit: 4 },
            flags: { isFeatured: true }
        }
    }),
});

export const bestsellerProductsQueryOptions = queryOptions({
    queryKey: ["products", "bestsellers"],
    queryFn: () => getProductsAction({
        data: {
            pagination: { limit: 4 },
            flags: { isBestseller: true }
        }
    }),
});