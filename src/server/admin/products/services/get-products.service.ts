import {
	and,
	asc,
	count,
	desc,
	eq,
	gte,
	ilike,
	inArray,
	lte,
} from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { product, variant } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	GetProductsInputType,
	GetProductsOutputType,
} from "../products.admin.type";

export const getProducts = async (
	data: GetProductsInputType,
): Promise<JsonOk<GetProductsOutputType>> => {
	try {
		const { searching, sorting, filters, flags, ranges, pagination } = data;

		const search = searching?.search;
		const searchType = searching?.searchType;

		const sortBy = sorting?.sortBy;
		const sortOrder = sorting?.sortOrder;

		const categoryIds = filters?.categoryIds ?? [];
		const colorIds = filters?.colorIds ?? [];
		const storageIds = filters?.storageIds ?? [];
		const ramIds = filters?.ramIds ?? [];
		const screenSizeIds = filters?.screenSizeIds ?? [];

		const isFeatured = flags?.isFeatured;
		const isBestseller = flags?.isBestseller;
		const isActive = flags?.isActive;
		const inStock = flags?.inStock;
		const hasReviews = flags?.hasReviews;

		const minPrice = ranges?.priceRange?.minPrice;
		const maxPrice = ranges?.priceRange?.maxPrice;
		const minStock = ranges?.stockRange?.minStock;
		const maxStock = ranges?.stockRange?.maxStock;
		const minRating = ranges?.ratingRange?.minRating;
		const maxRating = ranges?.ratingRange?.maxRating;

		const page = pagination.page;
		const limit = pagination.limit;
		const offset = (page - 1) * limit;

		const conditions = [];
		let orderByClause = desc(product.createdAt);

		if (categoryIds.length > 0) {
			conditions.push(inArray(product.categoryId, categoryIds));
		}

		if (isFeatured !== undefined) {
			conditions.push(eq(product.isFeatured, isFeatured));
		}

		if (isBestseller !== undefined) {
			conditions.push(eq(product.isBestseller, isBestseller));
		}

		if (isActive !== undefined) {
			conditions.push(eq(product.isActive, isActive));
		}

		if (minPrice !== undefined) {
			conditions.push(gte(variant.price, minPrice.toString()));
		}

		if (maxPrice !== undefined) {
			conditions.push(lte(variant.price, maxPrice.toString()));
		}

		if (minStock !== undefined) {
			conditions.push(gte(variant.stockQuantity, minStock));
		}

		if (maxStock !== undefined) {
			conditions.push(lte(variant.stockQuantity, maxStock));
		}

		if (inStock === true) {
			conditions.push(gte(variant.stockQuantity, 1));
		}

		if (hasReviews === true) {
			conditions.push(gte(product.reviewsCount, 1));
		}

		if (minRating !== undefined) {
			conditions.push(gte(product.ratingAvg, minRating.toString()));
		}

		if (maxRating !== undefined) {
			conditions.push(lte(product.ratingAvg, maxRating.toString()));
		}

		if (colorIds.length > 0) {
			conditions.push(inArray(variant.colorId, colorIds));
		}

		if (storageIds.length > 0) {
			conditions.push(inArray(variant.storageId, storageIds));
		}

		if (ramIds.length > 0) {
			conditions.push(inArray(variant.ramId, ramIds));
		}

		if (screenSizeIds.length > 0) {
			conditions.push(inArray(variant.screenSizeId, screenSizeIds));
		}

		if (search) {
			if (searchType === "slug") {
				conditions.push(ilike(product.slug, `%${search}%`));
			} else if (searchType === "brand") {
				conditions.push(ilike(product.brand, `%${search}%`));
			} else {
				conditions.push(ilike(product.name, `%${search}%`));
			}
		}

		if (sortBy === "name") {
			orderByClause =
				sortOrder === "asc" ? asc(product.name) : desc(product.name);
		} else if (sortBy === "reviews") {
			orderByClause =
				sortOrder === "asc"
					? asc(product.reviewsCount)
					: desc(product.reviewsCount);
		} else if (sortBy === "rating") {
			orderByClause =
				sortOrder === "asc" ? asc(product.ratingAvg) : desc(product.ratingAvg);
		} else if (sortBy === "price") {
			orderByClause =
				sortOrder === "asc" ? asc(variant.price) : desc(variant.price);
		} else {
			orderByClause =
				sortOrder === "asc" ? asc(product.createdAt) : desc(product.createdAt);
		}

		const [totalResult] = await db
			.select({
				total: count(),
			})
			.from(product)
			.leftJoin(
				variant,
				and(eq(variant.productId, product.id), eq(variant.isDefault, true)),
			)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const rows = await db
			.select({
				id: product.id,
				name: product.name,
				image: product.image,
				slug: product.slug,
				brand: product.brand,
				sku: variant.sku,
				price: variant.price,
				compareAtPrice: variant.compareAtPrice,
				stockQuantity: variant.stockQuantity,
				reviewsCount: product.reviewsCount,
				ratingAvg: product.ratingAvg,
				isFeatured: product.isFeatured,
				isBestseller: product.isBestseller,
				isActive: product.isActive,
				createdAt: product.createdAt,
				updatedAt: product.updatedAt,
			})
			.from(product)
			.innerJoin(
				variant,
				and(eq(variant.productId, product.id), eq(variant.isDefault, true)),
			)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.limit(limit)
			.offset(offset)
			.orderBy(orderByClause);

		const items = rows.map((row) => ({
			...row,
			price: Number(row.price),
			compareAtPrice:
				row.compareAtPrice === null ? null : Number(row.compareAtPrice),
			ratingAvg: Number(row.ratingAvg),
			createdAt: row.createdAt.toISOString(),
			updatedAt: row.updatedAt.toISOString(),
		}));

		const total = totalResult?.total ?? 0;
		const totalPages = Math.ceil(total / limit);

		return jsonOk<GetProductsOutputType>({
			status: HttpStatusCode.OK,
			message: "Products fetched successfully",
			data: {
				items,
				query: {
					searching,
					sorting,
					filters,
					flags,
					ranges,
				},
				pagination: {
					page,
					limit,
					total,
					totalPages,
					hasNextPage: page < totalPages,
					hasPreviousPage: page > 1,
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
