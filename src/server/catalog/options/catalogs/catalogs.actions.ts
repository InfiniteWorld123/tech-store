import { ensureSession } from "#/server/auth/ensure-session.middleware";
import { createServerFn } from "@tanstack/react-start";
import { createCatalogSchema } from "./catalogs.schemas";
import { createCatalog } from "./services/create-catalog.service";

export const createCatalogAction = createServerFn({ method: "POST" })
  .middleware([ensureSession])
  .inputValidator(createCatalogSchema)
  .handler(async ({ data }) => {
    return createCatalog(data);
  });
