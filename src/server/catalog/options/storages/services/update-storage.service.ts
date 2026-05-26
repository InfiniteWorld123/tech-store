import { and, eq, ne } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { storage } from "#/db/schema";
import {
	badRequestError,
	conflictError,
	notFoundError,
} from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	UpdateStorageInputType,
	UpdateStorageOutputType,
} from "../storages.types";

export const updateStorage = async (
	data: UpdateStorageInputType,
): Promise<JsonOk<UpdateStorageOutputType>> => {
	try {
		const { storageId, name, valueGb } = data;

		const [existingStorage] = await db
			.select({ id: storage.id })
			.from(storage)
			.where(eq(storage.id, storageId));

		if (!existingStorage) {
			throw notFoundError("Storage not found");
		}

		if (name !== undefined) {
			const [storageWithName] = await db
				.select({ id: storage.id })
				.from(storage)
				.where(and(eq(storage.name, name), ne(storage.id, storageId)));

			if (storageWithName) {
				throw conflictError("Storage name already exists");
			}
		}

		if (valueGb !== undefined) {
			const [storageWithValueGb] = await db
				.select({ id: storage.id })
				.from(storage)
				.where(and(eq(storage.valueGb, valueGb), ne(storage.id, storageId)));

			if (storageWithValueGb) {
				throw conflictError("Storage value already exists");
			}
		}

		const updateFields = {
			...(name !== undefined ? { name } : {}),
			...(valueGb !== undefined ? { valueGb } : {}),
		};

		if (Object.keys(updateFields).length === 0) {
			throw badRequestError("At least one field must be provided");
		}

		const [updatedStorage] = await db
			.update(storage)
			.set(updateFields)
			.where(eq(storage.id, storageId))
			.returning();

		if (!updatedStorage) {
			throw badRequestError("Storage update failed");
		}

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Storage updated successfully",
			data: {
				storage: {
					id: updatedStorage.id,
					name: updatedStorage.name,
					valueGb: updatedStorage.valueGb,
					createdAt: updatedStorage.createdAt.toISOString(),
					updatedAt: updatedStorage.updatedAt.toISOString(),
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
