import { inArray } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { storage } from "#/db/schema";
import { badRequestError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	DeleteStoragesInputType,
	DeleteStoragesOutputType,
} from "../storages.types";

export async function deleteStorages(
	data: DeleteStoragesInputType,
): Promise<JsonOk<DeleteStoragesOutputType>> {
	try {
		const { storageIds } = data;

		const deletedStorages = await db
			.delete(storage)
			.where(inArray(storage.id, storageIds))
			.returning();

		if (deletedStorages.length === 0) {
			throw badRequestError("Storages deletion failed");
		}

		const items = deletedStorages.map((item) => ({
			id: item.id,
			name: item.name,
			valueGb: item.valueGb,
			createdAt: item.createdAt.toISOString(),
			updatedAt: item.updatedAt.toISOString(),
		}));

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Storages deleted successfully",
			data: {
				storages: items,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
}
