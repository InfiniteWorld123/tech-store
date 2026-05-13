import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    slug: z.string().trim().min(1, "Slug is required"),
    image: z.string().trim().min(1).nullable().optional(),
});

export const deleteCategorySchema = z.object({
    catalogId: z.string().uuid("Category id must be a valid UUID"),
});

export const updateCategorySchema = z
    .object({
        catalogId: z.string().uuid("Category id must be a valid UUID"),
        name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
        slug: z.string().trim().min(1, "Slug is required").optional(),
        image: z.string().trim().min(1).nullable().optional(),
    })
    .refine(
        (value) =>
            value.name !== undefined ||
            value.slug !== undefined ||
            value.image !== undefined,
        {
            message: "At least one field must be provided",
            path: ["catalogId"],
        },
    );

export const listCategorySchema = z.object({
    searching: z
        .object({
            search: z.string().trim().min(1, "Search term is required").optional(),
            searchType: z.enum(["name", "id", "slug"]).default("name"),
        })
        .optional(),
});
