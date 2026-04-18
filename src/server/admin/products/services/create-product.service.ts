import { eq, inArray } from "drizzle-orm";
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
import {
	badRequestError,
	conflictError,
	notFoundError,
} from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	CreateProductInputType,
	CreateProductOutputType,
} from "../products.admin.type";

const getUniqueOptionalIds = (
	values: Array<string | null | undefined>,
): string[] => {
	return [...new Set(values.filter((value): value is string => value != null))];
};

const normalizeDefaultVariants = (
	variants: CreateProductInputType["variants"],
): CreateProductInputType["variants"] => {
	const defaultVariants = variants.filter(
		(variantItem) => variantItem.isDefault,
	);

	if (defaultVariants.length > 1) {
		throw badRequestError("Only one variant can be marked as default");
	}

	if (defaultVariants.length === 0) {
		return variants.map((variantItem, index) => ({
			...variantItem,
			isDefault: index === 0,
		}));
	}

	return variants;
};

const buildVariantRows = (
	productId: string,
	variants: CreateProductInputType["variants"],
) => {
	return variants.map((variantItem) => ({
		productId,
		sku: variantItem.sku,
		price: variantItem.price.toString(),
		compareAtPrice:
			variantItem.compareAtPrice == null
				? null
				: variantItem.compareAtPrice.toString(),
		stockQuantity: variantItem.stockQuantity,
		colorId: variantItem.colorId,
		storageId: variantItem.storageId,
		ramId: variantItem.ramId,
		screenSizeId: variantItem.screenSizeId,
		isDefault: variantItem.isDefault,
	}));
};

const buildVariantImageRows = (
	createdVariants: Array<{ id: string }>,
	variants: CreateProductInputType["variants"],
) => {
	return variants.flatMap((variantItem, index) => {
		const createdVariant = createdVariants[index];

		if (!createdVariant) {
			throw badRequestError("Variant creation failed");
		}

		return variantItem.images.map((image, imageIndex) => ({
			variantId: createdVariant.id,
			image,
			sortOrder: imageIndex,
		}));
	});
};

const ensureUniqueSkus = (variants: CreateProductInputType["variants"]) => {
	const skuValues = variants.map((variantItem) => variantItem.sku);
	const uniqueSkuValues = [...new Set(skuValues)];

	if (uniqueSkuValues.length !== skuValues.length) {
		throw conflictError("Duplicate SKU values are not allowed");
	}

	return uniqueSkuValues;
};

export const createProduct = async (
	data: CreateProductInputType,
): Promise<JsonOk<CreateProductOutputType>> => {
	try {
		const {
			categoryId,
			name,
			brand,
			slug,
			shortDescription,
			description,
			warrantyInfo,
			image,
			isFeatured,
			isBestseller,
			isActive,
			variants,
		} = data;

		const normalizedVariants = normalizeDefaultVariants(variants);
		const uniqueColorIds = getUniqueOptionalIds(
			normalizedVariants.map((variantItem) => variantItem.colorId),
		);
		const uniqueStorageIds = getUniqueOptionalIds(
			normalizedVariants.map((variantItem) => variantItem.storageId),
		);
		const uniqueRamIds = getUniqueOptionalIds(
			normalizedVariants.map((variantItem) => variantItem.ramId),
		);
		const uniqueScreenSizeIds = getUniqueOptionalIds(
			normalizedVariants.map((variantItem) => variantItem.screenSizeId),
		);
		const uniqueSkuValues = ensureUniqueSkus(normalizedVariants);

		await db.transaction(async (tx) => {
			const existingProductSlug = await tx
				.select({ id: product.id })
				.from(product)
				.where(eq(product.slug, slug));

			if (existingProductSlug.length > 0) {
				throw conflictError("Product slug already exists");
			}

			const existingCategory = await tx
				.select({ id: category.id })
				.from(category)
				.where(eq(category.id, categoryId));

			if (existingCategory.length === 0) {
				throw notFoundError("Category not found");
			}

			const existingColors =
				uniqueColorIds.length > 0
					? await tx
							.select({ id: color.id })
							.from(color)
							.where(inArray(color.id, uniqueColorIds))
					: [];

			if (existingColors.length !== uniqueColorIds.length) {
				throw notFoundError("One or more colors were not found");
			}

			const existingStorages =
				uniqueStorageIds.length > 0
					? await tx
							.select({ id: storage.id })
							.from(storage)
							.where(inArray(storage.id, uniqueStorageIds))
					: [];

			if (existingStorages.length !== uniqueStorageIds.length) {
				throw notFoundError("One or more storages were not found");
			}

			const existingRams =
				uniqueRamIds.length > 0
					? await tx
							.select({ id: ram.id })
							.from(ram)
							.where(inArray(ram.id, uniqueRamIds))
					: [];

			if (existingRams.length !== uniqueRamIds.length) {
				throw notFoundError("One or more RAM options were not found");
			}

			const existingScreenSizes =
				uniqueScreenSizeIds.length > 0
					? await tx
							.select({ id: screenSize.id })
							.from(screenSize)
							.where(inArray(screenSize.id, uniqueScreenSizeIds))
					: [];

			if (existingScreenSizes.length !== uniqueScreenSizeIds.length) {
				throw notFoundError("One or more screen sizes were not found");
			}

			const existingVariantSkus =
				uniqueSkuValues.length > 0
					? await tx
							.select({ sku: variant.sku })
							.from(variant)
							.where(inArray(variant.sku, uniqueSkuValues))
					: [];

			if (existingVariantSkus.length > 0) {
				throw conflictError("One or more SKU values already exist");
			}

			const [createdProduct] = await tx
				.insert(product)
				.values({
					categoryId,
					name,
					brand,
					slug,
					shortDescription,
					description,
					warrantyInfo,
					image,
					isFeatured,
					isBestseller,
					isActive,
				})
				.returning({ id: product.id });

			if (!createdProduct) {
				throw badRequestError("Product creation failed");
			}

			const variantRows = buildVariantRows(
				createdProduct.id,
				normalizedVariants,
			);
			const createdVariants = await tx
				.insert(variant)
				.values(variantRows)
				.returning({ id: variant.id });

			const variantImageRows = buildVariantImageRows(
				createdVariants,
				normalizedVariants,
			);

			await tx.insert(variantImage).values(variantImageRows);
		});

		return jsonOk<CreateProductOutputType>({
			status: HttpStatusCode.CREATED,
			message: "Product created successfully",
			data: {
				product: {
					...data,
					variants: normalizedVariants,
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
