import { z } from "zod";

export const createCatalogSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    slug: z.string().trim().min(1, "Slug is required"),
    image: z.string().trim().min(1).nullable().optional(),
});
