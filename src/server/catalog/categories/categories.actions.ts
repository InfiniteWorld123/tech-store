import { createServerFn } from "@tanstack/react-start";
import { ensureAdmin } from "#/server/auth/ensure-session.middleware";
import {
	createCategorySchema,
	deleteCategorySchema,
	listCategoriesSchema,
	updateCategorySchema,
} from "./categories.schemas";
import { createCategory } from "./services/create-category.service";
import { deleteCategory } from "./services/delete-category.service";
import { listCategories } from "./services/list-categories.service";
import { updateCategory } from "./services/update-category.service";

export const createCategoryAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(createCategorySchema)
	.handler(async ({ data }) => {
		return createCategory(data);
	});

export const deleteCategoryAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(deleteCategorySchema)
	.handler(async ({ data }) => {
		return deleteCategory(data);
	});

export const updateCategoryAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(updateCategorySchema)
	.handler(async ({ data }) => {
		return updateCategory(data);
	});

export const listCategoriesAction = createServerFn({ method: "GET" })
	.inputValidator(listCategoriesSchema)
	.handler(async ({ data }) => {
		return listCategories(data);
	});
