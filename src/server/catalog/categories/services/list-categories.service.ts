import type { SQL } from "drizzle-orm";
import { eq, ilike } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { category } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	ListCategoriesInputType,
	ListCategoriesOutputType,
} from "../categories.types";

export const listCategories = async (
	data: ListCategoriesInputType,
): Promise<JsonOk<ListCategoriesOutputType>> => {
	try {
		const searching = data.searching;
		const search = searching?.search;
		const searchType = searching?.searchType ?? "name";

		let searchCondition: SQL | undefined;

		if (search) {
			if (searchType === "id") {
				searchCondition = eq(category.id, search);
			}

			if (searchType === "name") {
				searchCondition = ilike(category.name, `%${search}%`);
			}

			if (searchType === "slug") {
				searchCondition = ilike(category.slug, `%${search}%`);
			}
		}

		const listedCategories = searchCondition
			? await db.select().from(category).where(searchCondition)
			: await db.select().from(category);

		const items = listedCategories.map((item) => ({
			id: item.id,
			name: item.name,
			slug: item.slug,
			image: item.image ?? null,
			createdAt: item.createdAt.toISOString(),
			updatedAt: item.updatedAt.toISOString(),
		}));

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Categories fetched successfully",
			data: {
				items,
				query: {
					searching: {
						search,
						searchType,
					},
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
