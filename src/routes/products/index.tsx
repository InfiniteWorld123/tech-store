import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ProductsPage } from "#/components/catalog/pages/products-page";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";
import {
	defaultProductsInput,
	listProductsQueryOptions,
} from "#/queries/products.queries";

const sortSchema = z
	.enum([
		"createdAt:desc",
		"price:asc",
		"price:desc",
		"rating:desc",
		"reviews:desc",
		"name:asc",
	])
	.default("createdAt:desc");

const coerceSearchArray = (value: unknown): string[] => {
	if (value === undefined) return [];
	if (Array.isArray(value)) return value.flatMap(coerceSearchArray);
	if (typeof value !== "string") return [];

	const trimmed = value.trim();
	if (!trimmed) return [];
	if (trimmed.startsWith("[")) {
		try {
			const parsed = JSON.parse(trimmed);
			return Array.isArray(parsed) ? parsed.flatMap(coerceSearchArray) : [];
		} catch {
			return [];
		}
	}
	return [trimmed];
};

const stringArraySearchSchema = z.preprocess(
	coerceSearchArray,
	z.array(z.string().trim().min(1)),
);

const searchSchema = z
	.object({
		page: z.number().int().min(1).default(1),
		sort: sortSchema,
		categoryIds: stringArraySearchSchema,
		colorIds: stringArraySearchSchema,
		storageIds: stringArraySearchSchema,
		ramIds: stringArraySearchSchema,
		screenSizeIds: stringArraySearchSchema,
		minPrice: z.number().nonnegative().optional(),
		maxPrice: z.number().nonnegative().optional(),
		search: z.string().trim().min(1).optional(),
		inStock: z.boolean().optional(),
		onSale: z.boolean().optional(),
		minRating: z.number().min(1).max(5).optional(),
	})
	.refine(
		(value) =>
			value.minPrice === undefined ||
			value.maxPrice === undefined ||
			value.minPrice <= value.maxPrice,
		{
			message: "Minimum price cannot be greater than maximum price",
			path: ["maxPrice"],
		},
	);

export const Route = createFileRoute("/products/")({
	validateSearch: searchSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ context: { queryClient }, deps }) =>
		queryClient
			.ensureQueryData(
				listProductsQueryOptions({
					data: {
						...defaultProductsInput,
						pagination: { page: deps.page, limit: 12 },
						searching: deps.search
							? { search: deps.search, searchType: "name" }
							: undefined,
						filters: {
							categoryIds: deps.categoryIds,
							colorIds: deps.colorIds,
							storageIds: deps.storageIds,
							ramIds: deps.ramIds,
							screenSizeIds: deps.screenSizeIds,
						},
						sorting: {
							sortBy:
								(deps.sort.split(":")[0] as
									| "name"
									| "createdAt"
									| "reviews"
									| "rating"
									| "price") ?? "createdAt",
							sortOrder: (deps.sort.split(":")[1] as "asc" | "desc") ?? "desc",
						},
						ranges: {
							priceRange:
								deps.minPrice !== undefined || deps.maxPrice !== undefined
									? { minPrice: deps.minPrice, maxPrice: deps.maxPrice }
									: undefined,
							ratingRange:
								deps.minRating !== undefined
									? { minRating: deps.minRating }
									: undefined,
						},
						flags: {
							isActive: true,
							inStock: deps.inStock ? true : undefined,
							isSale: deps.onSale ? true : undefined,
						},
					},
				}),
			)
			.catch(() => null),
	component: ProductsPage,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
