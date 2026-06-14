import { and, asc, eq, ne } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import {
	color,
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
	UpdateVariantInputType,
	UpdateVariantOutputType,
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

export const updateVariant = async (
	data: UpdateVariantInputType,
): Promise<JsonOk<UpdateVariantOutputType>> => {
	try {
		const { variantId, images, ...updateFields } = data;

		const hasFieldsToUpdate =
			Object.values(updateFields).some((value) => value !== undefined) ||
			images !== undefined;

		if (!hasFieldsToUpdate) {
			throw badRequestError(
				"At least one field must be provided to update the variant",
			);
		}

		const [existingVariant] = await db
			.select({
				id: variant.id,
				productId: variant.productId,
				price: variant.price,
				compareAtPrice: variant.compareAtPrice,
				isDefault: variant.isDefault,
			})
			.from(variant)
			.where(eq(variant.id, variantId));

		if (!existingVariant) {
			throw notFoundError("Variant not found");
		}

		if (updateFields.sku !== undefined) {
			const existingSku = await db
				.select({ id: variant.id })
				.from(variant)
				.where(eq(variant.sku, updateFields.sku));

			const skuBelongsToAnotherVariant = existingSku.some(
				(item) => item.id !== variantId,
			);

			if (skuBelongsToAnotherVariant) {
				throw conflictError("Variant SKU already exists");
			}
		}

		if (updateFields.colorId !== undefined && updateFields.colorId !== null) {
			const existingColor = await db
				.select({ id: color.id })
				.from(color)
				.where(eq(color.id, updateFields.colorId));

			if (existingColor.length === 0) {
				throw notFoundError("Color not found");
			}
		}

		if (
			updateFields.storageId !== undefined &&
			updateFields.storageId !== null
		) {
			const existingStorage = await db
				.select({ id: storage.id })
				.from(storage)
				.where(eq(storage.id, updateFields.storageId));

			if (existingStorage.length === 0) {
				throw notFoundError("Storage option not found");
			}
		}

		if (updateFields.ramId !== undefined && updateFields.ramId !== null) {
			const existingRam = await db
				.select({ id: ram.id })
				.from(ram)
				.where(eq(ram.id, updateFields.ramId));

			if (existingRam.length === 0) {
				throw notFoundError("RAM option not found");
			}
		}

		if (
			updateFields.screenSizeId !== undefined &&
			updateFields.screenSizeId !== null
		) {
			const existingScreenSize = await db
				.select({ id: screenSize.id })
				.from(screenSize)
				.where(eq(screenSize.id, updateFields.screenSizeId));

			if (existingScreenSize.length === 0) {
				throw notFoundError("Screen size option not found");
			}
		}

		const nextPrice =
			updateFields.price !== undefined
				? updateFields.price
				: Number(existingVariant.price);
		const nextCompareAtPrice =
			updateFields.compareAtPrice !== undefined
				? updateFields.compareAtPrice
				: existingVariant.compareAtPrice === null
					? null
					: Number(existingVariant.compareAtPrice);

		ensureCompareAtPrice(nextPrice, nextCompareAtPrice);

		if (updateFields.isDefault === true) {
			await db
				.update(variant)
				.set({ isDefault: false })
				.where(
					and(
						eq(variant.productId, existingVariant.productId),
						ne(variant.id, variantId),
					),
				);
		}

		if (updateFields.isDefault === false && existingVariant.isDefault) {
			const [replacementDefault] = await db
				.select({ id: variant.id })
				.from(variant)
				.where(
					and(
						eq(variant.productId, existingVariant.productId),
						ne(variant.id, variantId),
					),
				)
				.orderBy(asc(variant.createdAt))
				.limit(1);

			if (!replacementDefault) {
				throw badRequestError(
					"The only variant for a product must remain default",
				);
			}

			await db
				.update(variant)
				.set({ isDefault: true })
				.where(eq(variant.id, replacementDefault.id));
		}

		const mappedUpdateValues = Object.fromEntries(
			Object.entries(updateFields)
				.filter(([, value]) => value !== undefined)
				.map(([key, value]) => {
					if (key === "price" && typeof value === "number") {
						return [key, value.toString()];
					}

					if (key === "compareAtPrice" && typeof value === "number") {
						return [key, value.toString()];
					}

					return [key, value];
				}),
		);

		const [updatedVariant] = await db
			.update(variant)
			.set(mappedUpdateValues)
			.where(eq(variant.id, variantId))
			.returning();

		if (!updatedVariant) {
			throw badRequestError("Variant update failed");
		}

		if (images !== undefined) {
			await db
				.delete(variantImage)
				.where(eq(variantImage.variantId, variantId));

			const variantImageRows = images.map((image, imageIndex) => ({
				variantId,
				image,
				sortOrder: imageIndex,
			}));

			await db.insert(variantImage).values(variantImageRows);
		}

		const updatedImages = await db
			.select({
				image: variantImage.image,
			})
			.from(variantImage)
			.where(eq(variantImage.variantId, variantId))
			.orderBy(asc(variantImage.sortOrder));

		const payload = {
			variant: updatedVariant,
			images: updatedImages.map((item) => item.image),
		};

		return jsonOk<UpdateVariantOutputType>({
			status: HttpStatusCode.OK,
			message: "Variant updated successfully",
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
