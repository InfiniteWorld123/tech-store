import { queryOptions } from "@tanstack/react-query";
import {
	getProductAction,
	getProductBySlugAction,
	getProductsAction,
} from "#/server/catalog/products/products.actions";
import type {
	GetProductInputType,
	GetProductsInputType,
} from "#/server/catalog/products/products.types";

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
}) =>
	queryOptions({
		queryKey: ["products", data],
		queryFn: () => getProductsAction({ data }),
	});

export const getProductQueryOptions = (data: GetProductInputType) =>
	queryOptions({
		queryKey: ["products", "detail", data.productId],
		queryFn: () => getProductAction({ data }),
	});

export const getProductBySlugQueryOptions = ({ slug }: { slug: string }) =>
	queryOptions({
		queryKey: ["products", "detail-by-slug", slug],
		queryFn: () => getProductBySlugAction({ data: { slug } }),
	});
