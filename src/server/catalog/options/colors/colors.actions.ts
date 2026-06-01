import { createServerFn } from "@tanstack/react-start";
import { ensureAdmin } from "#/server/auth/ensure-session.middleware";
import {
	createColorSchema,
	deleteColorSchema,
	deleteColorsSchema,
	listColorsSchema,
	updateColorSchema,
} from "./colors.schemas";
import { createColor } from "./services/create-color.service";
import { deleteColor } from "./services/delete-color.service";
import { deleteColors } from "./services/delete-colors.service";
import { listColors } from "./services/list-colors.service";
import { updateColor } from "./services/update-color.service";

export const createColorAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(createColorSchema)
	.handler(async ({ data }) => {
		return createColor(data);
	});

export const deleteColorAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(deleteColorSchema)
	.handler(async ({ data }) => {
		return deleteColor(data);
	});

export const deleteColorsAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(deleteColorsSchema)
	.handler(async ({ data }) => {
		return deleteColors(data);
	});

export const listColorsAction = createServerFn({ method: "GET" })
	.inputValidator(listColorsSchema)
	.handler(async ({ data }) => {
		return listColors(data);
	});

export const updateColorAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(updateColorSchema)
	.handler(async ({ data }) => {
		return updateColor(data);
	});
