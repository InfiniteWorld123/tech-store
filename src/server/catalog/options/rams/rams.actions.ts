import { createServerFn } from "@tanstack/react-start";
import { ensureAdmin } from "#/server/auth/ensure-session.middleware";
import {
	createRamSchema,
	deleteRamSchema,
	deleteRamsSchema,
	listRamsSchema,
	updateRamSchema,
} from "./rams.schemas";
import { createRam } from "./services/create-ram.service";
import { deleteRam } from "./services/delete-ram.service";
import { deleteRams } from "./services/delete-rams.service";
import { listRams } from "./services/list-rams.service";
import { updateRam } from "./services/update-ram.service";

export const createRamAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(createRamSchema)
	.handler(async ({ data }) => {
		return createRam(data);
	});

export const deleteRamAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(deleteRamSchema)
	.handler(async ({ data }) => {
		return deleteRam(data);
	});

export const deleteRamsAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(deleteRamsSchema)
	.handler(async ({ data }) => {
		return deleteRams(data);
	});

export const updateRamAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(updateRamSchema)
	.handler(async ({ data }) => {
		return updateRam(data);
	});

export const listRamsAction = createServerFn({ method: "GET" })
	.inputValidator(listRamsSchema)
	.handler(async ({ data }) => {
		return listRams(data);
	});
