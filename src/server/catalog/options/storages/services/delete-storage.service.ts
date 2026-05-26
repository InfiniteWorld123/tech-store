import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { storage } from "#/db/schema";
import { badRequestError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	DeleteStorageInputType,
	DeleteStorageOutputType,
} from "../storages.types";

export const deleteStorage = async (
	data: DeleteStorageInputType,
): Promise<JsonOk<DeleteStorageOutputType>> => {
	try {
		const { storageId } = data;

		const [existingStorage] = await db
			.select({ id: storage.id })
			.from(storage)
			.where(eq(storage.id, storageId));

		if (!existingStorage) {
			throw notFoundError("Storage not found");
		}

		const [deletedStorage] = await db
			.delete(storage)
			.where(eq(storage.id, storageId))
			.returning();

		if (!deletedStorage) {
			throw badRequestError("Storage deletion failed");
		}

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Storage deleted successfully",
			data: {
				storageId: deletedStorage.id,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
