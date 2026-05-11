import type z from "zod";
import type { createCatalogSchema } from "./catalogs.schemas";

// inferred types
export type CreateCatalogSchemaType = z.infer<typeof createCatalogSchema>;

// input types
export type CreateCatalogInputType = CreateCatalogSchemaType;

// output types
export type CreateCatalogOutputType = {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
  };