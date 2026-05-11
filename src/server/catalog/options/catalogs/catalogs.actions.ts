import { ensureSession } from "#/server/auth/ensure-session.middleware";
import { createServerFn } from "@tanstack/react-start";
import { createCategorySchema, deleteCategorySchema, updateCategorySchema } from "./catalogs.schemas";
import { createCategory } from "./services/create-catalog.service";
import { deleteCategory } from "./services/delete-catalog.service";
import { updateCategory } from "./services/update-catalog.service";

export const createCategoryAction = createServerFn({ method: "POST" })
  .middleware([ensureSession])
  .inputValidator(createCategorySchema)
  .handler(async ({ data }) => {
    return createCategory(data);
  });


export const deleteCategoryAction = createServerFn({ method: "POST" })
  .middleware([ensureSession])
  .inputValidator(deleteCategorySchema)
  .handler(async ({ data }) => {
    return deleteCategory(data);
  });

export const updateCategoryAction = createServerFn({ method: "POST" })
  .middleware([ensureSession])
  .inputValidator(updateCategorySchema)
  .handler(async ({ data }) => {
    return updateCategory(data);
  });