import { z } from "zod";

const productSearchTypeSchema = z.enum(["all", "id", "name", "slug", "brand"]);

const productSortBySchema = z.enum([
	"name",
	"createdAt",
	"reviews",
	"rating",
	"price",
]);

const productSortOrderSchema = z.enum(["asc", "desc"]);

export const getProductSchema = z.object({
	productId: z.string().min(1, "Product id is required"),
});

export const getProductBySlugSchema = z.object({
	slug: z.string().trim().min(1, "Slug is required"),
});

export const getProductsSchema = z.object({
	searching: z
		.object({
			search: z.string().trim().min(1, "Search term is required").optional(),
			searchType: productSearchTypeSchema.optional(),
		})
		.optional(),

	sorting: z
		.object({
			sortBy: productSortBySchema.default("createdAt"),
			sortOrder: productSortOrderSchema.default("desc"),
		})
		.optional(),

	filters: z
		.object({
			categoryIds: z.array(z.string().min(1)).default([]),
			colorIds: z.array(z.string().min(1)).default([]),
			storageIds: z.array(z.string().min(1)).default([]),
			ramIds: z.array(z.string().min(1)).default([]),
			screenSizeIds: z.array(z.string().min(1)).default([]),
		})
		.optional(),

	flags: z
		.object({
			isFeatured: z.boolean().optional(),
			isBestseller: z.boolean().optional(),
			isActive: z.boolean().optional(),
			isSale: z.boolean().optional(),
			inStock: z.boolean().optional(),
			hasReviews: z.boolean().optional(),
		})
		.optional(),

	ranges: z
		.object({
			priceRange: z
				.object({
					minPrice: z.number().nonnegative().optional(),
					maxPrice: z.number().nonnegative().optional(),
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
				)
				.optional(),

			ratingRange: z
				.object({
					minRating: z.number().min(1).max(5).optional(),
					maxRating: z.number().min(1).max(5).optional(),
				})
				.refine(
					(value) =>
						value.minRating === undefined ||
						value.maxRating === undefined ||
						value.minRating <= value.maxRating,
					{
						message: "Minimum rating cannot be greater than maximum rating",
						path: ["maxRating"],
					},
				)
				.optional(),

			stockRange: z
				.object({
					minStock: z.number().int().nonnegative().optional(),
					maxStock: z.number().int().nonnegative().optional(),
				})
				.refine(
					(value) =>
						value.minStock === undefined ||
						value.maxStock === undefined ||
						value.minStock <= value.maxStock,
					{
						message: "Minimum stock cannot be greater than maximum stock",
						path: ["maxStock"],
					},
				)
				.optional(),
		})
		.optional(),

	pagination: z
		.object({
			page: z.number().int().min(1).default(1),
			limit: z
				.number()
				.int()
				.min(1, "Limit must be at least 1")
				.max(100, "Limit cannot be greater than 100")
				.default(10),
		})
		.default({ page: 1, limit: 10 }),
});

const productCategorySchema = z.object({
	categoryId: z.string().uuid("Category id must be a valid UUID"),
});

const productBaseSchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters"),
	brand: z.string().trim().min(1, "Brand is required"),
	slug: z.string().trim().min(1, "Slug is required"),
	shortDescription: z.string().trim().min(1).nullable().optional(),
	description: z.string().trim().min(1, "Description is required"),
	warrantyInfo: z.string().trim().min(1).nullable().optional(),
	image: z.string().trim().min(1).nullable().optional(),
	isFeatured: z.boolean().default(false),
	isBestseller: z.boolean().default(false),
	isActive: z.boolean().default(true),
});

export const createProductSchema = productBaseSchema.merge(
	productCategorySchema,
);

export const updateProductSchema = z.object({
	productId: z.string().min(1, "Product id is required"),
	categoryId: z.string().uuid("Category id must be a valid UUID").optional(),
	name: z.string().trim().min(2).optional(),
	brand: z.string().trim().min(1).optional(),
	slug: z.string().trim().min(1).optional(),
	shortDescription: z.string().trim().min(1).nullable().optional(),
	description: z.string().trim().min(1).optional(),
	warrantyInfo: z.string().trim().min(1).nullable().optional(),
	image: z.string().trim().min(1).nullable().optional(),
	isFeatured: z.boolean().optional(),
	isBestseller: z.boolean().optional(),
	isActive: z.boolean().optional(),
});

export const deleteProductSchema = z.object({
	productId: z.string().min(1, "Product id is required"),
});

export const deleteProductsSchema = z.object({
	productIds: z
		.array(z.string().min(1))
		.min(1, "At least one product id is required"),
});
