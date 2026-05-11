import { HttpStatusCode } from "#/constants/http";
import { jsonOk, type JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { category } from "#/db/schema";
import { badRequestError, conflictError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import { eq } from "drizzle-orm";
import type { CreateCategoryInputType, CreateCategoryOutputType } from "../catalogs.types";






export async function createCategory(data: CreateCategoryInputType)
	: Promise<JsonOk<CreateCategoryOutputType>> {
	try {
		const { image, name, slug } = data;

		const [existingCategory] = await db
			.select({ id: category.id })
			.from(category)
			.where(eq(category.slug, slug));

		if (existingCategory) {
			throw conflictError("Category slug already exists");
		}

		const [createdCategory] = await db
			.insert(category)
			.values({
				name,
				image,
				slug,
			})
			.returning()

		if (!createdCategory) {
			throw badRequestError('Category creation failed')
		}

		return jsonOk({
			status: HttpStatusCode.CREATED,
			message: "catalog is created successfully",
			data: {
				id: createdCategory.id,
				name: createdCategory.name,
				slug: createdCategory.slug,
				image: createdCategory.image ?? null,
				createdAt: createdCategory.createdAt.toISOString(),
				updatedAt: createdCategory.updatedAt.toISOString(),
			}
		})
	} catch (error) {
		throw handleError(error)
	}
}
