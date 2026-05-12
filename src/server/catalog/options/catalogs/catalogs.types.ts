import type z from "zod";
import type { createCategorySchema, deleteCategorySchema, listCategorySchema, updateCategorySchema } from "./catalogs.schemas";

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

export type ListCategorySchemaType = z.infer<typeof listCategorySchema>;

// input types
export type CreateCategoryInputType = CreateCategorySchemaType;

export type DeleteCategoryInputType = DeleteCategorySchemaType;

export type UpdateCategoryInputType = UpdateCategorySchemaType;

export type ListCategoryInputType = ListCategorySchemaType;

// output types
export type CreateCategoryOutputType = Category

export type DeleteCategoryOutputType = Category

export type UpdateCategoryOutputType = Category

export type ListCategoryOutputType = {
  items: Category[];
  query: {
    searching?: ListCategoryInputType["searching"];
  };
};