import { eq, ilike, type SQL } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { storage } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	ListStoragesInputType,
	ListStoragesOutputType,
} from "../storages.types";

export const listStorages = async (
	data: ListStoragesInputType,
): Promise<JsonOk<ListStoragesOutputType>> => {
	try {
		const { searching } = data;
		const search = searching?.search;
		const searchType = searching?.searchType ?? "name";

		let searchCondition: SQL | undefined;

		if (search) {
			if (searchType === "name") {
				searchCondition = ilike(storage.name, `%${search}%`);
			}

			if (searchType === "valueGb") {
				const valueGb = Number(search);

				if (!Number.isNaN(valueGb)) {
					searchCondition = eq(storage.valueGb, valueGb);
				}
			}
		}

		const existingStorages = searchCondition
			? await db.select().from(storage).where(searchCondition)
			: await db.select().from(storage);

		const items = existingStorages.map((item) => ({
			id: item.id,
			name: item.name,
			valueGb: item.valueGb,
			createdAt: item.createdAt.toISOString(),
			updatedAt: item.updatedAt.toISOString(),
		}));

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Storages fetched successfully",
			data: {
				items,
				query: {
					searching,
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
