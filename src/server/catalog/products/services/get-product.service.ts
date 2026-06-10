import { asc, eq } from "drizzle-orm";
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
	variantImage,
} from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	GetProductInputType,
	GetProductOutputType,
} from "../products.types";

export const getProduct = async (
	data: GetProductInputType,
): Promise<JsonOk<GetProductOutputType>> => {
	try {
		const rows = await db
			.select({
				productId: product.id,
				categoryId: category.id,
				categoryName: category.name,
				categorySlug: category.slug,
				categoryIcon: category.icon,
				categoryIconColor: category.iconColor,
				categoryIconBg: category.iconBg,
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
				variantImage: variantImage.image,
				variantImageSortOrder: variantImage.sortOrder,
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
			.leftJoin(variant, eq(variant.productId, product.id))
			.leftJoin(variantImage, eq(variantImage.variantId, variant.id))
			.leftJoin(color, eq(color.id, variant.colorId))
			.leftJoin(storage, eq(storage.id, variant.storageId))
			.leftJoin(ram, eq(ram.id, variant.ramId))
			.leftJoin(screenSize, eq(screenSize.id, variant.screenSizeId))
			.where(eq(product.id, data.productId))
			.orderBy(asc(variant.id), asc(variantImage.sortOrder));

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
		const variantsById = new Map<
			string,
			NonNullable<GetProductOutputType["product"]>["variants"][number]
		>();

		for (const row of rows) {
			if (!row.variantId) {
				continue;
			}

			const existingVariant = variantsById.get(row.variantId);

			if (existingVariant) {
				if (row.variantImage) {
					existingVariant.images.push(row.variantImage);
				}

				continue;
			}

			variantsById.set(row.variantId, {
				id: row.variantId,
				sku: row.variantSku as string,
				price: Number(row.variantPrice as string),
				compareAtPrice:
					row.variantCompareAtPrice === null
						? null
						: Number(row.variantCompareAtPrice),
				stockQuantity: row.variantStockQuantity as number,
				isDefault: row.variantIsDefault as boolean,
				images: row.variantImage ? [row.variantImage] : [],
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
				createdAt: (row.variantCreatedAt as Date).toISOString(),
				updatedAt: (row.variantUpdatedAt as Date).toISOString(),
			});
		}

		return jsonOk<GetProductOutputType>({
			status: HttpStatusCode.OK,
			message: "Product fetched successfully",
			data: {
				product: {
					id: firstRow.productId,
					category: {
						id: firstRow.categoryId,
						name: firstRow.categoryName,
						slug: firstRow.categorySlug,
						icon: firstRow.categoryIcon,
						iconColor: firstRow.categoryIconColor,
						iconBg: firstRow.categoryIconBg,
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
					variants: Array.from(variantsById.values()),
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
