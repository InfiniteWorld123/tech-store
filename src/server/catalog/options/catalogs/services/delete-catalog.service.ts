import { HttpStatusCode } from "#/constants/http";
import { jsonOk, type JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { category } from "#/db/schema";
import { badRequestError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import { eq } from "drizzle-orm";
import type { DeleteCategoryInputType, DeleteCategoryOutputType } from "../catalogs.types";


export async function deleteCategory(data: DeleteCategoryInputType)
	: Promise<JsonOk<DeleteCategoryOutputType>> {
	try {
		const { catalogId } = data;

		const [existingCategory] = await db
			.select({ id: category.id })
			.from(category)
			.where(eq(category.id, catalogId));

		if (!existingCategory) {
			throw notFoundError("Category is already deleted");
		}

		const [deletedCategory] = await db
			.delete(category)
			.where(eq(category.id, catalogId))
			.returning()

		if (!deletedCategory) {
			throw badRequestError('Category deletion failed')
		}

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "catalog is deleted successfully",
			data: {
				id: deletedCategory.id,
				name: deletedCategory.name,
				slug: deletedCategory.slug,
				image: deletedCategory.image ?? null,
				createdAt: deletedCategory.createdAt.toISOString(),
				updatedAt: deletedCategory.updatedAt.toISOString(),
			}
		})
	} catch (error) {
		throw handleError(error)
	}
}
