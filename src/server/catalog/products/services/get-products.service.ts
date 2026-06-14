import {
	and,
	asc,
	count,
	desc,
	eq,
	gte,
	ilike,
	inArray,
	isNull,
	lte,
	or,
	sql,
} from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { product, variant } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	GetProductsInputType,
	GetProductsOutputType,
} from "../products.types";

const zUuidRegex =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const sqlIn = (values: string[]) =>
	sql.join(
		values.map((value) => sql`${value}`),
		sql`, `,
	);

export const getProducts = async (
	data: GetProductsInputType,
): Promise<JsonOk<GetProductsOutputType>> => {
	try {
		const { searching, sorting, filters, flags, ranges, pagination } = data;

		const search = searching?.search;
		const searchType = searching?.searchType ?? "all";

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
		const isSale = flags?.isSale;
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
		const variantFilters = [];
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
			variantFilters.push(sql`vf.price >= ${minPrice.toString()}`);
		}

		if (maxPrice !== undefined) {
			variantFilters.push(sql`vf.price <= ${maxPrice.toString()}`);
		}

		if (minStock !== undefined) {
			variantFilters.push(sql`vf.stock_quantity >= ${minStock}`);
		}

		if (maxStock !== undefined) {
			variantFilters.push(sql`vf.stock_quantity <= ${maxStock}`);
		}

		if (inStock === true) {
			variantFilters.push(sql`vf.stock_quantity >= 1`);
		}

		if (inStock === false) {
			conditions.push(or(isNull(variant.id), lte(variant.stockQuantity, 0)));
		}

		if (isSale === true) {
			variantFilters.push(
				sql`vf.compare_at_price is not null and vf.compare_at_price > vf.price`,
			);
		}

		if (isSale === false) {
			variantFilters.push(
				sql`vf.compare_at_price is null or vf.compare_at_price <= vf.price`,
			);
		}

		if (hasReviews === true) {
			conditions.push(gte(product.reviewsCount, 1));
		}

		if (hasReviews === false) {
			conditions.push(eq(product.reviewsCount, 0));
		}

		if (minRating !== undefined) {
			conditions.push(gte(product.ratingAvg, minRating.toString()));
		}

		if (maxRating !== undefined) {
			conditions.push(lte(product.ratingAvg, maxRating.toString()));
		}

		if (colorIds.length > 0) {
			variantFilters.push(sql`vf.color_id in (${sqlIn(colorIds)})`);
		}

		if (storageIds.length > 0) {
			variantFilters.push(sql`vf.storage_id in (${sqlIn(storageIds)})`);
		}

		if (ramIds.length > 0) {
			variantFilters.push(sql`vf.ram_id in (${sqlIn(ramIds)})`);
		}

		if (screenSizeIds.length > 0) {
			variantFilters.push(sql`vf.screen_size_id in (${sqlIn(screenSizeIds)})`);
		}

		if (variantFilters.length > 0) {
			conditions.push(
				sql`exists (
					select 1
					from "variant" vf
					where vf.product_id = ${product.id}
					and ${sql.join(variantFilters, sql` and `)}
				)`,
			);
		}

		if (search) {
			const isUuid = zUuidRegex.test(search);

			if (searchType === "id") {
				conditions.push(
					eq(
						product.id,
						isUuid ? search : "00000000-0000-0000-0000-000000000000",
					),
				);
			} else if (searchType === "slug") {
				conditions.push(ilike(product.slug, `%${search}%`));
			} else if (searchType === "brand") {
				conditions.push(ilike(product.brand, `%${search}%`));
			} else if (searchType === "name") {
				conditions.push(ilike(product.name, `%${search}%`));
			} else {
				const searchConditions = [
					ilike(product.name, `%${search}%`),
					ilike(product.brand, `%${search}%`),
					ilike(product.slug, `%${search}%`),
				];

				if (isUuid) {
					searchConditions.push(eq(product.id, search));
				}

				conditions.push(or(...searchConditions));
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
				defaultVariantId: variant.id,
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
			.leftJoin(
				variant,
				and(eq(variant.productId, product.id), eq(variant.isDefault, true)),
			)
			.where(conditions.length > 0 ? and(...conditions) : undefined)
			.limit(limit)
			.offset(offset)
			.orderBy(orderByClause);

		const items = rows.map((row) => ({
			...row,
			price: row.price === null ? null : Number(row.price),
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
