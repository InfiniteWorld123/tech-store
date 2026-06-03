import { z } from "zod";
import type { GetProductsInputType } from "#/server/catalog/products/products.types";

const optionalBooleanSearchSchema = z
	.union([
		z.boolean(),
		z.literal("true").transform(() => true),
		z.literal("false").transform(() => false),
	])
	.optional()
	.catch(undefined);

const optionalNumberSearchSchema = z.coerce
	.number()
	.nonnegative()
	.optional()
	.catch(undefined);

const optionalRatingSearchSchema = z.coerce
	.number()
	.min(1)
	.max(5)
	.optional()
	.catch(undefined);

const optionalIntegerSearchSchema = z.coerce
	.number()
	.int()
	.nonnegative()
	.optional()
	.catch(undefined);

const productSortSearchSchema = z.enum([
	"createdAt-desc",
	"createdAt-asc",
	"name-asc",
	"name-desc",
	"price-asc",
	"price-desc",
	"rating-desc",
	"reviews-desc",
]);

export const productsSearchSchema = z.object({
	search: z.string().trim().optional(),
	searchType: z.enum(["name", "brand", "slug"]).default("name"),
	status: z.enum(["all", "active", "inactive"]).default("all"),

	categoryIds: z
		.preprocess((value) => {
			if (value === undefined) return [];
			if (Array.isArray(value)) return value;

			return [value];
		}, z.array(z.string()))
		.default([]),

	isFeatured: optionalBooleanSearchSchema,
	isBestseller: optionalBooleanSearchSchema,
	isSale: optionalBooleanSearchSchema,
	inStock: optionalBooleanSearchSchema,
	hasReviews: optionalBooleanSearchSchema,

	minPrice: optionalNumberSearchSchema,
	maxPrice: optionalNumberSearchSchema,
	minRating: optionalRatingSearchSchema,
	maxRating: optionalRatingSearchSchema,
	minStock: optionalIntegerSearchSchema,
	maxStock: optionalIntegerSearchSchema,

	page: z.coerce.number().int().min(1).catch(1),
	limit: z.coerce.number().int().min(1).max(100).catch(10),
	sort: productSortSearchSchema.default("createdAt-desc"),
});

export type ProductsSearch = z.infer<typeof productsSearchSchema>;

export function mapProductsSearchToInput(
	search: ProductsSearch,
): GetProductsInputType {
	const [sortBy, sortOrder] = search.sort.split("-") as [
		NonNullable<GetProductsInputType["sorting"]>["sortBy"],
		NonNullable<GetProductsInputType["sorting"]>["sortOrder"],
	];

	return {
		searching: search.search
			? {
					search: search.search,
					searchType: search.searchType,
				}
			: undefined,

		sorting: {
			sortBy,
			sortOrder,
		},

		filters: {
			categoryIds: search.categoryIds,
			colorIds: [],
			ramIds: [],
			screenSizeIds: [],
			storageIds: [],
		},

		flags: {
			isActive:
				search.status === "active"
					? true
					: search.status === "inactive"
						? false
						: undefined,
			isFeatured: search.isFeatured,
			isBestseller: search.isBestseller,
			isSale: search.isSale,
			inStock: search.inStock,
			hasReviews: search.hasReviews,
		},

		ranges: {
			priceRange:
				search.minPrice !== undefined || search.maxPrice !== undefined
					? {
							minPrice: search.minPrice,
							maxPrice: search.maxPrice,
						}
					: undefined,

			ratingRange:
				search.minRating !== undefined || search.maxRating !== undefined
					? {
							minRating: search.minRating,
							maxRating: search.maxRating,
						}
					: undefined,

			stockRange:
				search.minStock !== undefined || search.maxStock !== undefined
					? {
							minStock: search.minStock,
							maxStock: search.maxStock,
						}
					: undefined,
		},

		pagination: {
			page: search.page,
			limit: search.limit,
		},
	};
}
