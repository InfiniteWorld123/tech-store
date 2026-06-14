import type { z } from "zod";
import type {
	seedCatalogSchema,
	seedCatalogSummarySchema,
} from "./seed-catalog.schemas";

export type SeedCatalogInputType = z.infer<typeof seedCatalogSchema>;
export type SeedCatalogSummaryType = z.infer<typeof seedCatalogSummarySchema>;
export type SeedCatalogOutputType = SeedCatalogSummaryType;
