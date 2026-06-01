import { createServerFn } from "@tanstack/react-start";
import { ensureAdmin } from "../../auth/ensure-session.middleware";
import { createVariant } from "./services/create-variant.service";
import { deleteVariant } from "./services/delete-variant.service";
import { updateVariant } from "./services/update-variant.service";
import {
	createVariantSchema,
	deleteVariantSchema,
	updateVariantSchema,
} from "./variants.schemas";

export const createVariantAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(createVariantSchema)
	.handler(async ({ data }) => {
		return createVariant(data);
	});

export const updateVariantAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(updateVariantSchema)
	.handler(async ({ data }) => {
		return updateVariant(data);
	});

export const deleteVariantAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(deleteVariantSchema)
	.handler(async ({ data }) => {
		return deleteVariant(data);
	});
