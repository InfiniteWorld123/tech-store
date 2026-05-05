import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import {
	color,
	product,
	ram,
	screenSize,
	storage,
	variant,
	variantImage,
} from "#/db/schema";
import {
	badRequestError,
	conflictError,
	notFoundError,
} from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	CreateVariantInputType,
	CreateVariantOutputType,
} from "../variants.types";

const ensureCompareAtPrice = (
	price: number,
	compareAtPrice: number | null | undefined,
) => {
	if (
		compareAtPrice !== undefined &&
		compareAtPrice !== null &&
		compareAtPrice < price
	) {
		throw badRequestError(
			"Compare-at price cannot be less than the variant price",
		);
	}
};

export const createVariant = async (
	data: CreateVariantInputType,
): Promise<JsonOk<CreateVariantOutputType>> => {
	try {
		const {
			productId,
			sku,
			price,
			compareAtPrice,
			stockQuantity,
			colorId,
			storageId,
			ramId,
			screenSizeId,
			isDefault,
			images,
		} = data;

		ensureCompareAtPrice(price, compareAtPrice);

		const payload = await db.transaction(async (tx) => {
			const existingProduct = await tx
				.select({ id: product.id })
				.from(product)
				.where(eq(product.id, productId));

			if (existingProduct.length === 0) {
				throw notFoundError("Product not found");
			}

			const existingSku = await tx
				.select({ id: variant.id })
				.from(variant)
				.where(eq(variant.sku, sku));

			if (existingSku.length > 0) {
				throw conflictError("Variant SKU already exists");
			}

			if (colorId != null) {
				const existingColor = await tx
					.select({ id: color.id })
					.from(color)
					.where(eq(color.id, colorId));

				if (existingColor.length === 0) {
					throw notFoundError("Color not found");
				}
			}

			if (storageId != null) {
				const existingStorage = await tx
					.select({ id: storage.id })
					.from(storage)
					.where(eq(storage.id, storageId));

				if (existingStorage.length === 0) {
					throw notFoundError("Storage option not found");
				}
			}

			if (ramId != null) {
				const existingRam = await tx
					.select({ id: ram.id })
					.from(ram)
					.where(eq(ram.id, ramId));

				if (existingRam.length === 0) {
					throw notFoundError("RAM option not found");
				}
			}

			if (screenSizeId != null) {
				const existingScreenSize = await tx
					.select({ id: screenSize.id })
					.from(screenSize)
					.where(eq(screenSize.id, screenSizeId));

				if (existingScreenSize.length === 0) {
					throw notFoundError("Screen size option not found");
				}
			}

			const existingVariants = await tx
				.select({ id: variant.id })
				.from(variant)
				.where(eq(variant.productId, productId));

			const shouldBeDefault = isDefault || existingVariants.length === 0;

			if (shouldBeDefault) {
				await tx
					.update(variant)
					.set({ isDefault: false })
					.where(eq(variant.productId, productId));
			}

			const [createdVariant] = await tx
				.insert(variant)
				.values({
					productId,
					sku,
					price: price.toString(),
					compareAtPrice:
						compareAtPrice == null ? null : compareAtPrice.toString(),
					stockQuantity,
					colorId: colorId ?? null,
					storageId: storageId ?? null,
					ramId: ramId ?? null,
					screenSizeId: screenSizeId ?? null,
					isDefault: shouldBeDefault,
				})
				.returning();

			if (!createdVariant) {
				throw badRequestError("Variant creation failed");
			}

			const variantImageRows = images.map((image, imageIndex) => ({
				variantId: createdVariant.id,
				image,
				sortOrder: imageIndex,
			}));

			await tx.insert(variantImage).values(variantImageRows);

			return {
				variant: createdVariant,
				images,
			};
		});

		return jsonOk<CreateVariantOutputType>({
			status: HttpStatusCode.CREATED,
			message: "Variant created successfully",
			data: {
				variant: {
					id: payload.variant.id,
					productId: payload.variant.productId,
					sku: payload.variant.sku,
					price: Number(payload.variant.price),
					compareAtPrice:
						payload.variant.compareAtPrice == null
							? null
							: Number(payload.variant.compareAtPrice),
					stockQuantity: payload.variant.stockQuantity,
					colorId: payload.variant.colorId,
					storageId: payload.variant.storageId,
					ramId: payload.variant.ramId,
					screenSizeId: payload.variant.screenSizeId,
					isDefault: payload.variant.isDefault,
					images: payload.images,
					createdAt: payload.variant.createdAt.toISOString(),
					updatedAt: payload.variant.updatedAt.toISOString(),
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
