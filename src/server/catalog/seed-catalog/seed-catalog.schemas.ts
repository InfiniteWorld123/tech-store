import { z } from "zod";

export const seedCatalogSchema = z.object({});

export const seedCatalogSummarySchema = z.object({
	categoriesCreated: z.number().int().nonnegative(),
	optionsCreated: z.number().int().nonnegative(),
	productsCreated: z.number().int().nonnegative(),
	variantsCreated: z.number().int().nonnegative(),
	skippedProducts: z.number().int().nonnegative(),
	skippedVariants: z.number().int().nonnegative(),
});
