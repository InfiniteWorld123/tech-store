import { eq, ilike, type SQL } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { color } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	ListColorsInputType,
	ListColorsOutputType,
} from "../colors.types";

export const listColors = async (
	data: ListColorsInputType,
): Promise<JsonOk<ListColorsOutputType>> => {
	try {
		const { searching } = data;
		const search = searching?.search;
		const searchType = searching?.searchType ?? "name";

		let searchCondition: SQL | undefined;

		if (search) {
			if (searchType === "name") {
				searchCondition = ilike(color.name, `%${search}%`);
			}

			if (searchType === "hexCode") {
				searchCondition = eq(color.hexCode, search);
			}
		}

		const existingColors = searchCondition
			? await db.select().from(color).where(searchCondition)
			: await db.select().from(color);

		const items = existingColors.map((item) => ({
			id: item.id,
			name: item.name,
			hexCode: item.hexCode ?? null,
			createdAt: item.createdAt.toISOString(),
			updatedAt: item.updatedAt.toISOString(),
		}));

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Colors fetched successfully",
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
