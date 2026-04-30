import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "../../auth/ensure-session.middleware";
import { createVariant } from "./services/create-variant.service";
import { deleteVariant } from "./services/delete-variant.service";
import { updateVariant } from "./services/update-variant.service";
import {
	createVariantValidationSchema,
	deleteVariantValidationSchema,
	updateVariantValidationSchema,
} from "./variants.validation";

export const createVariantAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(createVariantValidationSchema)
	.handler(async ({ data }) => {
		return createVariant(data);
	});

export const updateVariantAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(updateVariantValidationSchema)
	.handler(async ({ data }) => {
		return updateVariant(data);
	});

export const deleteVariantAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(deleteVariantValidationSchema)
	.handler(async ({ data }) => {
		return deleteVariant(data);
	});
