import type z from "zod";
import type { createCategorySchema, deleteCategorySchema, updateCategorySchema } from "./catalogs.schemas";

// helper types
export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

// inferred types
export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;

export type DeleteCategorySchemaType = z.infer<typeof deleteCategorySchema>;

export type UpdateCategorySchemaType = z.infer<typeof updateCategorySchema>;

// input types
export type CreateCategoryInputType = CreateCategorySchemaType;

export type DeleteCategoryInputType = DeleteCategorySchemaType;

export type UpdateCategoryInputType = UpdateCategorySchemaType;

// output types
export type CreateCategoryOutputType = Category

export type DeleteCategoryOutputType = Category

export type UpdateCategoryOutputType = Category