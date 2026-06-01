import { createServerFn } from "@tanstack/react-start";
import { ensureAdmin } from "#/server/auth/ensure-session.middleware";
import {
	createScreenSchema,
	deleteScreenSchema,
	deleteScreensSchema,
	listScreensSchema,
	updateScreenSchema,
} from "./screens.schemas";
import { createScreen } from "./services/create-screen.service";
import { deleteScreen } from "./services/delete-screen.service";
import { deleteScreens } from "./services/delete-screens.service";
import { listScreens } from "./services/list-screens.service";
import { updateScreen } from "./services/update-screen.service";

export const createScreenAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(createScreenSchema)
	.handler(async ({ data }) => {
		return createScreen(data);
	});

export const deleteScreenAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(deleteScreenSchema)
	.handler(async ({ data }) => {
		return deleteScreen(data);
	});

export const deleteScreensAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(deleteScreensSchema)
	.handler(async ({ data }) => {
		return deleteScreens(data);
	});

export const listScreensAction = createServerFn({ method: "GET" })
	.inputValidator(listScreensSchema)
	.handler(async ({ data }) => {
		return listScreens(data);
	});

export const updateScreenAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(updateScreenSchema)
	.handler(async ({ data }) => {
		return updateScreen(data);
	});
