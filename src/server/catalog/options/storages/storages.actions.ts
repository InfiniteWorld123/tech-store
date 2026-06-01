import { createServerFn } from "@tanstack/react-start";
import { ensureAdmin } from "#/server/auth/ensure-session.middleware";
import { createStorage } from "./services/create-storage.service";
import { deleteStorage } from "./services/delete-storage.service";
import { deleteStorages } from "./services/delete-storages.service";
import { listStorages } from "./services/list-storages.service";
import { updateStorage } from "./services/update-storage.service";
import {
	createStorageSchema,
	deleteStorageSchema,
	deleteStoragesSchema,
	listStoragesSchema,
	updateStorageSchema,
} from "./storages.schemas";

export const createStorageAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(createStorageSchema)
	.handler(async ({ data }) => {
		return createStorage(data);
	});

export const deleteStorageAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(deleteStorageSchema)
	.handler(async ({ data }) => {
		return deleteStorage(data);
	});

export const deleteStoragesAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(deleteStoragesSchema)
	.handler(async ({ data }) => {
		return deleteStorages(data);
	});

export const listStoragesAction = createServerFn({ method: "GET" })
	.inputValidator(listStoragesSchema)
	.handler(async ({ data }) => {
		return listStorages(data);
	});

export const updateStorageAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(updateStorageSchema)
	.handler(async ({ data }) => {
		return updateStorage(data);
	});
