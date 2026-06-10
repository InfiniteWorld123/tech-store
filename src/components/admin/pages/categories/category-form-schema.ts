import { z } from "zod";
import { createCategorySchema } from "#/server/catalog/categories/categories.schemas";

// The create/edit forms hold plain strings ("" = unset); empty values are
// converted to null on submit before hitting the server schema.
export const categoryFormSchema = createCategorySchema.extend({
	icon: z.string(),
	iconColor: z.string(),
	iconBg: z.string(),
});
