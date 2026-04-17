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
import {
	category,
	color,
	product,
	ram,
	screenSize,
	storage,
	variant,
} from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	CreateProductInputType,
	DeleteProductInputType,
	DeleteProductsInputType,
	GetProductInputType,
	GetProductOutputType,
	GetProductsInputType,
	GetProductsOutputType,
	UpdateProductInputType,
} from "./products.admin.type";

export const getProduct = async (data: GetProductInputType) => {
	try {
		const rows = await db
			.select({
				productId: product.id,
				categoryId: category.id,
				categoryName: category.name,
				categorySlug: category.slug,
				categoryImage: category.image,
				name: product.name,
				brand: product.brand,
				slug: product.slug,
				shortDescription: product.shortDescription,
				description: product.description,
				warrantyInfo: product.warrantyInfo,
				image: product.image,
				ratingAvg: product.ratingAvg,
				reviewsCount: product.reviewsCount,
				isFeatured: product.isFeatured,
				isBestseller: product.isBestseller,
				isActive: product.isActive,
				productCreatedAt: product.createdAt,
				productUpdatedAt: product.updatedAt,
				variantId: variant.id,
				variantSku: variant.sku,
				variantPrice: variant.price,
				variantCompareAtPrice: variant.compareAtPrice,
				variantStockQuantity: variant.stockQuantity,
				variantIsDefault: variant.isDefault,
				variantImage: variant.image,
				colorId: color.id,
				colorName: color.name,
				colorHexCode: color.hexCode,
				storageId: storage.id,
				storageName: storage.name,
				storageValueGb: storage.valueGb,
				ramId: ram.id,
				ramName: ram.name,
				ramValueGb: ram.valueGb,
				screenSizeId: screenSize.id,
				screenSizeName: screenSize.name,
				screenSizeValueInches: screenSize.valueInches,
				variantCreatedAt: variant.createdAt,
				variantUpdatedAt: variant.updatedAt,
			})
			.from(product)
			.innerJoin(category, eq(category.id, product.categoryId))
			.innerJoin(variant, eq(variant.productId, product.id))
			.leftJoin(color, eq(color.id, variant.colorId))
			.leftJoin(storage, eq(storage.id, variant.storageId))
			.leftJoin(ram, eq(ram.id, variant.ramId))
			.leftJoin(screenSize, eq(screenSize.id, variant.screenSizeId))
			.where(eq(product.id, data.productId));

		if (rows.length === 0) {
			return jsonOk<GetProductOutputType>({
				status: HttpStatusCode.OK,
				message: "Product fetched successfully",
				data: {
					product: null,
				},
			});
		}

		const [firstRow] = rows;

		const selectedProduct = {
			id: firstRow.productId,
			category: {
				id: firstRow.categoryId,
				name: firstRow.categoryName,
				slug: firstRow.categorySlug,
				image: firstRow.categoryImage,
			},
			name: firstRow.name,
			brand: firstRow.brand,
			slug: firstRow.slug,
			shortDescription: firstRow.shortDescription,
			description: firstRow.description,
			warrantyInfo: firstRow.warrantyInfo,
			image: firstRow.image,
			ratingAvg: Number(firstRow.ratingAvg),
			reviewsCount: firstRow.reviewsCount,
			isFeatured: firstRow.isFeatured,
			isBestseller: firstRow.isBestseller,
			isActive: firstRow.isActive,
			createdAt: firstRow.productCreatedAt.toISOString(),
			updatedAt: firstRow.productUpdatedAt.toISOString(),
			variants: rows.map((row) => ({
				id: row.variantId,
				sku: row.variantSku,
				price: Number(row.variantPrice),
				compareAtPrice:
					row.variantCompareAtPrice === null
						? null
						: Number(row.variantCompareAtPrice),
				stockQuantity: row.variantStockQuantity,
				isDefault: row.variantIsDefault,
				image: row.variantImage,
				color: row.colorId
					? {
							id: row.colorId,
							name: row.colorName ?? "",
							hexCode: row.colorHexCode,
						}
					: null,
				storage: row.storageId
					? {
							id: row.storageId,
							name: row.storageName ?? "",
							valueGb: row.storageValueGb ?? 0,
						}
					: null,
				ram: row.ramId
					? {
							id: row.ramId,
							name: row.ramName ?? "",
							valueGb: row.ramValueGb ?? 0,
						}
					: null,
				screenSize: row.screenSizeId
					? {
							id: row.screenSizeId,
							name: row.screenSizeName ?? "",
							valueInches: Number(row.screenSizeValueInches),
						}
					: null,
				createdAt: row.variantCreatedAt.toISOString(),
				updatedAt: row.variantUpdatedAt.toISOString(),
			})),
		};

		return jsonOk<GetProductOutputType>({
			status: HttpStatusCode.OK,
			message: "Product fetched successfully",
			data: {
				product: selectedProduct,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};

export const getProducts = async (
	data: GetProductsInputType,
): Promise<JsonOk<GetProductsOutputType>> => {
	try {
		// 1. Read input
		const { searching, sorting, filters, flags, ranges, pagination } = data;

		const search = searching?.search;
		const searchType = searching?.searchType;

		const sortBy = sorting?.sortBy;
		const sortOrder = sorting?.sortOrder;

		const categoryIds = filters?.categoryIds ?? [];

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

		const colorIds = filters?.colorIds ?? [];
		const storageIds = filters?.storageIds ?? [];
		const ramIds = filters?.ramIds ?? [];
		const screenSizeIds = filters?.screenSizeIds ?? [];

		const page = pagination.page;
		const limit = pagination.limit;
		const offset = (page - 1) * limit;

		// 2. Build filters
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

		// 3. Build sorting
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

		// 4. Query database
		const [totalResult] = await db
			.select({
				total: count(),
			})
			.from(product)
			.innerJoin(
				variant,
				and(eq(variant.productId, product.id), eq(variant.isDefault, true)),
			)
			.where(conditions.length > 0 ? and(...conditions) : undefined);

		const products = await db
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

		// 5. Map database rows to API items
		const items = products.map((productItem) => ({
			...productItem,
			price: Number(productItem.price),
			compareAtPrice:
				productItem.compareAtPrice === null
					? null
					: Number(productItem.compareAtPrice),
			ratingAvg: Number(productItem.ratingAvg),
			createdAt: productItem.createdAt.toISOString(),
			updatedAt: productItem.updatedAt.toISOString(),
		}));

		const total = totalResult?.total ?? 0;
		const totalPages = Math.ceil(total / limit);
		const hasNextPage = page < totalPages;
		const hasPreviousPage = page > 1;

		// 6. Return response
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
					hasNextPage,
					hasPreviousPage,
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};

export const createProduct = async (data: CreateProductInputType) => {
	try {
		return {
			ok: true,
			message: "Created admin product",
			data,
		};
	} catch (error) {
		handleError(error);
	}
};

export const updateProduct = async (data: UpdateProductInputType) => {
	try {
		return {
			ok: true,
			message: "Updated admin product",
			data,
		};
	} catch (error) {
		handleError(error);
	}
};

export const deleteProduct = async (data: DeleteProductInputType) => {
	try {
		return {
			ok: true,
			message: "Deleted admin product",
			data,
		};
	} catch (error) {
		handleError(error);
	}
};

export const deleteProducts = async (data: DeleteProductsInputType) => {
	try {
		return {
			ok: true,
			message: "Deleted admin products",
			data,
		};
	} catch (error) {
		handleError(error);
	}
};
