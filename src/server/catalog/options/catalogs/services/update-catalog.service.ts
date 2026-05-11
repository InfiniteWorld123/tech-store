import { and, eq, ne } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { jsonOk, type JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { category } from "#/db/schema";
import {
  badRequestError,
  conflictError,
  notFoundError,
} from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
  UpdateCategoryInputType,
  UpdateCategoryOutputType,
} from "../catalogs.types";

export async function updateCategory(
  data: UpdateCategoryInputType,
): Promise<JsonOk<UpdateCategoryOutputType>> {
  try {
    const { catalogId, name, slug, image } = data;

    const [existingCategory] = await db
      .select({ id: category.id })
      .from(category)
      .where(eq(category.id, catalogId));

    if (!existingCategory) {
      throw notFoundError("Category not found");
    }

    if (slug !== undefined) {
      const [categoryWithSlug] = await db
        .select({ id: category.id })
        .from(category)
        .where(and(eq(category.slug, slug), ne(category.id, catalogId)));

      if (categoryWithSlug) {
        throw conflictError("Category slug already exists");
      }
    }

    const updateFields = {
      ...(name !== undefined ? { name } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(image !== undefined ? { image } : {}),
    };

    if (Object.keys(updateFields).length === 0) {
      throw badRequestError("At least one field must be provided");
    }

    const [updatedCategory] = await db
      .update(category)
      .set(updateFields)
      .where(eq(category.id, catalogId))
      .returning();

    if (!updatedCategory) {
      throw badRequestError("Category update failed");
    }

    return jsonOk({
      status: HttpStatusCode.OK,
      message: "Category updated successfully",
      data: {
        id: updatedCategory.id,
        name: updatedCategory.name,
        slug: updatedCategory.slug,
        image: updatedCategory.image ?? null,
        createdAt: updatedCategory.createdAt.toISOString(),
        updatedAt: updatedCategory.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    throw handleError(error);
  }
}
