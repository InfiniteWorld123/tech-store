import { eq, ilike, type SQL } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { screenSize } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	ListScreensInputType,
	ListScreensOutputType,
} from "../screens.types";

export const listScreens = async (
	data: ListScreensInputType,
): Promise<JsonOk<ListScreensOutputType>> => {
	try {
		const { searching } = data;
		const search = searching?.search;
		const searchType = searching?.searchType ?? "name";

		let searchCondition: SQL | undefined;

		if (search) {
			if (searchType === "name") {
				searchCondition = ilike(screenSize.name, `%${search}%`);
			}

			if (searchType === "valueInches") {
				const valueInches = Number(search);

				if (!Number.isNaN(valueInches)) {
					searchCondition = eq(screenSize.valueInches, String(valueInches));
				}
			}
		}

		const existingScreens = searchCondition
			? await db.select().from(screenSize).where(searchCondition)
			: await db.select().from(screenSize);

		const items = existingScreens.map((item) => ({
			id: item.id,
			name: item.name,
			valueInches: Number(item.valueInches),
			createdAt: item.createdAt.toISOString(),
			updatedAt: item.updatedAt.toISOString(),
		}));

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Screen sizes fetched successfully",
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
