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
	CreateProductInputType,
	CreateProductOutputType,
} from "../products.type";

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
		} = data;

		const createdProduct = await db.transaction(async (tx) => {
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

			const [nextProduct] = await tx
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
				.returning();

			if (!nextProduct) {
				throw badRequestError("Product creation failed");
			}

			return nextProduct;
		});

		return jsonOk<CreateProductOutputType>({
			status: HttpStatusCode.CREATED,
			message: "Product created successfully",
			data: {
				product: createdProduct,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
