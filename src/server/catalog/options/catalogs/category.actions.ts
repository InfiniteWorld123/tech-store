import { ensureSession } from "#/server/auth/ensure-session.middleware";
import { createServerFn } from "@tanstack/react-start";
import { createCategorySchema, deleteCategorySchema, listCategorySchema, updateCategorySchema } from "./category.schemas";
import { createCategory } from "./services/create-category.service";
import { deleteCategory } from "./services/delete-category.service";
import { updateCategory } from "./services/update-category.service";
import { listCategory } from "./services/list-category.service";

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

export const listCategoryAction = createServerFn({ method: "POST" })
  .middleware([ensureSession])
  .inputValidator(listCategorySchema)
  .handler(async ({ data }) => {
    return listCategory(data);
  });