import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { category } from "#/db/schema";
import { badRequestError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	DeleteCategoryInputType,
	DeleteCategoryOutputType,
} from "../categories.types";

export const deleteCategory = async (
	data: DeleteCategoryInputType,
): Promise<JsonOk<DeleteCategoryOutputType>> => {
	try {
		const { categoryId } = data;

		const [existingCategory] = await db
			.select({ id: category.id })
			.from(category)
			.where(eq(category.id, categoryId));

		if (!existingCategory) {
			throw notFoundError("Category is already deleted");
		}

		const [deletedCategory] = await db
			.delete(category)
			.where(eq(category.id, categoryId))
			.returning();

		if (!deletedCategory) {
			throw badRequestError("Category deletion failed");
		}

		return jsonOk<DeleteCategoryOutputType>({
			status: HttpStatusCode.OK,
			message: "Category deleted successfully",
			data: {
				categoryId: deletedCategory.id,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
