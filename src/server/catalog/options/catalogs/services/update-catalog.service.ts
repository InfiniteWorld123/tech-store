import { HttpStatusCode } from "#/constants/http";
import { jsonOk, type JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { category } from "#/db/schema";
import { badRequestError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import { eq } from "drizzle-orm";
import type { UpdateCategoryInputType, UpdateCategoryOutputType } from "../catalogs.types";


export async function updateCategory(data: UpdateCategoryInputType)
	: Promise<JsonOk<UpdateCategoryOutputType>> {
	try {
		const { catalogId, name, slug, image } = data;

		const [existingCategory] = await db
			.select({ id: category.id })
			.from(category)
			.where(eq(category.id, catalogId));

		if (!existingCategory) {
			throw notFoundError("Category is already deleted");
		}

		const [updatedCategory] = await db
			.update(category)
			.set({
				name,
				slug,
				image
			})
			.where(eq(category.id, catalogId))
			.returning()

		if (!updatedCategory) {
			throw badRequestError('Category deletion failed')
		}

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "catalog is deleted successfully",
			data: {
				id: updatedCategory.id,
				name: updatedCategory.name,
				slug: updatedCategory.slug,
				image: updatedCategory.image ?? null,
				createdAt: updatedCategory.createdAt.toISOString(),
				updatedAt: updatedCategory.updatedAt.toISOString(),
			}
		})
	} catch (error) {
		throw handleError(error)
	}
}
