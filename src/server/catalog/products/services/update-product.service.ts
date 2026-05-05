import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { category, product } from "#/db/schema";
import {
	badRequestError,
	conflictError,
	notFoundError,
} from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	UpdateProductInputType,
	UpdateProductOutputType,
} from "../products.types";

export const updateProduct = async (
	data: UpdateProductInputType,
): Promise<JsonOk<UpdateProductOutputType>> => {
	try {
		const { productId, ...updateFields } = data;

		const hasFieldsToUpdate = Object.values(updateFields).some(
			(value) => value !== undefined,
		);

		if (!hasFieldsToUpdate) {
			throw badRequestError(
				"At least one field must be provided to update the product",
			);
		}

		const existingProduct = await db
			.select({ id: product.id, slug: product.slug })
			.from(product)
			.where(eq(product.id, productId));

		if (existingProduct.length === 0) {
			throw notFoundError("Product not found");
		}

		if (updateFields.categoryId !== undefined) {
			const existingCategory = await db
				.select({ id: category.id })
				.from(category)
				.where(eq(category.id, updateFields.categoryId));

			if (existingCategory.length === 0) {
				throw notFoundError("Category not found");
			}
		}

		if (updateFields.slug !== undefined) {
			const existingSlug = await db
				.select({ id: product.id })
				.from(product)
				.where(eq(product.slug, updateFields.slug));

			const slugBelongsToAnotherProduct = existingSlug.some(
				(item) => item.id !== productId,
			);

			if (slugBelongsToAnotherProduct) {
				throw conflictError("Product slug already exists");
			}
		}

		const updateValues = Object.fromEntries(
			Object.entries(updateFields).filter(([, value]) => value !== undefined),
		);

		const [updatedProduct] = await db
			.update(product)
			.set(updateValues)
			.where(eq(product.id, productId))
			.returning();

		if (!updatedProduct) {
			throw badRequestError("Product update failed");
		}

		return jsonOk<UpdateProductOutputType>({
			status: HttpStatusCode.OK,
			message: "Product updated successfully",
			data: {
				product: updatedProduct,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
