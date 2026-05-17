import { eq, or } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { storage } from "#/db/schema";
import { badRequestError, conflictError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	CreateStorageInputType,
	CreateStorageOutputType,
} from "../storages.types";

export async function createStorage(
	data: CreateStorageInputType,
): Promise<JsonOk<CreateStorageOutputType>> {
	try {
		const { name, valueGb } = data;

		const existingStorages = await db
			.select({
				name: storage.name,
				valueGb: storage.valueGb,
			})
			.from(storage)
			.where(or(eq(storage.name, name), eq(storage.valueGb, valueGb)));

		if (existingStorages.some((item) => item.name === name)) {
			throw conflictError("Storage name already exists");
		}

		if (existingStorages.some((item) => item.valueGb === valueGb)) {
			throw conflictError("Storage value already exists");
		}

		const [createdStorage] = await db
			.insert(storage)
			.values({
				name,
				valueGb,
			})
			.returning();

		if (!createdStorage) {
			throw badRequestError("Storage creation failed");
		}

		return jsonOk({
			status: HttpStatusCode.CREATED,
			message: "Storage created successfully",
			data: {
				id: createdStorage.id,
				name: createdStorage.name,
				valueGb: createdStorage.valueGb,
				createdAt: createdStorage.createdAt.toISOString(),
				updatedAt: createdStorage.updatedAt.toISOString(),
			},
		});
	} catch (error) {
		throw handleError(error);
	}
}
