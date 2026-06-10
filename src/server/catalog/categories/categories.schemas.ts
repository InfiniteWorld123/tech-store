import { z } from "zod";

export const createCategorySchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters"),
	slug: z.string().trim().min(1, "Slug is required"),
	icon: z.string().nullable().optional(),
	iconColor: z.string().nullable().optional(),
	iconBg: z.string().nullable().optional(),
});

export const deleteCategorySchema = z.object({
	categoryId: z.string().uuid("Category id must be a valid UUID"),
});

export const updateCategorySchema = z
	.object({
		categoryId: z.string().uuid("Category id must be a valid UUID"),
		name: z
			.string()
			.trim()
			.min(2, "Name must be at least 2 characters")
			.optional(),
		slug: z.string().trim().min(1, "Slug is required").optional(),
		icon: z.string().nullable().optional(),
		iconColor: z.string().nullable().optional(),
		iconBg: z.string().nullable().optional(),
	})
	.refine(
		(value) =>
			value.name !== undefined ||
			value.slug !== undefined ||
			value.icon !== undefined ||
			value.iconColor !== undefined ||
			value.iconBg !== undefined,
		{
			message: "At least one field must be provided",
			path: ["categoryId"],
		},
	);

export const listCategoriesSchema = z.object({
	searching: z
		.object({
			search: z.string().trim().min(1, "Search term is required").optional(),
			searchType: z.enum(["name", "id", "slug"]).default("name"),
		})
		.optional(),
});
