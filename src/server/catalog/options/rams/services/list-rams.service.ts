import { jsonOk, type JsonOk } from "#/constants/json";
import { handleError } from "#/errors/error-handler";
import { eq, type SQL } from "drizzle-orm";
import type { ListRamsInputType, ListRamsOutputType } from "../rams.types";
import { ram } from "#/db/schema";
import { db } from "#/db/drizzle";
import { HttpStatusCode } from "#/constants/http";

export async function listRams(
	data: ListRamsInputType
): Promise<JsonOk<ListRamsOutputType>> {
	try {
		const { searching } = data;
		const search = searching?.search
		const searchType = searching?.searchType ?? "name"

		let searchCondition: SQL | undefined;

		if (search) {
			if (searchType === "name") {
				searchCondition = eq(ram.name, search);
			}

			if (searchType === "valueGb") {
				const valueGb = Number(search);
			
				if (!Number.isNaN(valueGb)) {
				  searchCondition = eq(ram.valueGb, valueGb);
				}
			  }
		}
		const existingRams = searchCondition
			? await db.select().from(ram).where(searchCondition)
			: await db.select().from(ram);

		const items = existingRams.map((item) => ({
			id: item.id,
			name: item.name,
			valueGb: Number(item.valueGb),
			createdAt: item.createdAt.toISOString(),
			updatedAt: item.updatedAt.toISOString(),
		}));

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "RAMs listed successfully",
			data: {
				rams: items,
				query: {
					searching
				}
			},
		});
	} catch (error) {
		throw handleError(error)
	}
}
