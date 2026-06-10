import type z from "zod";
import type {
	createCategorySchema,
	deleteCategorySchema,
	listCategoriesSchema,
	updateCategorySchema,
} from "./categories.schemas";

// helper types
export type Category = {
	id: string;
	name: string;
	slug: string;
	icon: string | null;
	iconColor: string | null;
	iconBg: string | null;
	createdAt: string;
	updatedAt: string;
};

export type CategoryWithCount = Category & {
	totalProducts: number;
};

// input types
export type CreateCategoryInputType = z.infer<typeof createCategorySchema>;

export type DeleteCategoryInputType = z.infer<typeof deleteCategorySchema>;

export type UpdateCategoryInputType = z.infer<typeof updateCategorySchema>;

export type ListCategoriesInputType = z.infer<typeof listCategoriesSchema>;

// output types
export type CreateCategoryOutputType = {
	category: Category;
};

export type DeleteCategoryOutputType = {
	categoryId: DeleteCategoryInputType["categoryId"];
};

export type UpdateCategoryOutputType = {
	category: Category;
};

export type ListCategoriesOutputType = {
	items: CategoryWithCount[];
	query: {
		searching?: ListCategoriesInputType["searching"];
	};
};
