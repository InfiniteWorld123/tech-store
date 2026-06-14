import { createServerFn } from "@tanstack/react-start";
import { ensureAdmin } from "#/server/auth/ensure-session.middleware";
import { seedCatalogSchema } from "./seed-catalog.schemas";
import { seedCatalog } from "./services/seed-catalog.service";

export const seedCatalogAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(seedCatalogSchema)
	.handler(async () => {
		return seedCatalog();
	});
