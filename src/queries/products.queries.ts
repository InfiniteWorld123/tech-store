import { queryOptions } from "@tanstack/react-query";
import { getProductsAction } from "#/server/catalog/products/products.actions";
import type { GetProductsInputType } from "#/server/catalog/products/products.types";
import { getProductMetricsAction } from "#/server/analytics/analytics.actions";

export const defaultProductsInput = {
	pagination: {
		page: 1,
		limit: 10,
	},
} satisfies GetProductsInputType;

export const featuredProductsQueryOptions = queryOptions({
	queryKey: ["products", "featured"],
	queryFn: () =>
		getProductsAction({
			data: {
				pagination: { limit: 4 },
				flags: { isFeatured: true },
			},
		}),
});

export const bestsellerProductsQueryOptions = queryOptions({
	queryKey: ["products", "bestsellers"],
	queryFn: () =>
		getProductsAction({
			data: {
				pagination: { limit: 4 },
				flags: { isBestseller: true },
			},
		}),
});

export const listProductsQueryOptions = ({
	data,
}: {
	data: GetProductsInputType;
}) => {
	return queryOptions({
		queryKey: ["products", data],
		queryFn: () => getProductsAction({ data }),
	});
};

export const getProductMetricsQueryOptions = (data = {}) => {
	return queryOptions({
		queryKey: ["products", "metrics", data],
		queryFn: () =>
			getProductMetricsAction({ data }),
	}); 
};
