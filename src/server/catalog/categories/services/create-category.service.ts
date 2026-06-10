import { eq, or } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { category } from "#/db/schema";
import { badRequestError, conflictError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	CreateCategoryInputType,
	CreateCategoryOutputType,
} from "../categories.types";

export const createCategory = async (
	data: CreateCategoryInputType,
): Promise<JsonOk<CreateCategoryOutputType>> => {
	try {
		const { icon, iconColor, iconBg, name, slug } = data;

		const existingCategories = await db
			.select({
				name: category.name,
				slug: category.slug,
			})
			.from(category)
			.where(or(eq(category.name, name), eq(category.slug, slug)));

		if (existingCategories.some((item) => item.name === name)) {
			throw conflictError("Category name already exists");
		}

		if (existingCategories.some((item) => item.slug === slug)) {
			throw conflictError("Category slug already exists");
		}

		const [createdCategory] = await db
			.insert(category)
			.values({
				name,
				slug,
				icon,
				iconColor,
				iconBg,
			})
			.returning();

		if (!createdCategory) {
			throw badRequestError("Category creation failed");
		}

		return jsonOk({
			status: HttpStatusCode.CREATED,
			message: "Category created successfully",
			data: {
				category: {
					id: createdCategory.id,
					name: createdCategory.name,
					slug: createdCategory.slug,
					icon: createdCategory.icon ?? null,
					iconColor: createdCategory.iconColor ?? null,
					iconBg: createdCategory.iconBg ?? null,
					createdAt: createdCategory.createdAt.toISOString(),
					updatedAt: createdCategory.updatedAt.toISOString(),
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
