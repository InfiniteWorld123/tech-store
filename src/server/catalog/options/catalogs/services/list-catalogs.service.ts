import { eq, ilike } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { jsonOk, type JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { category } from "#/db/schema";
import {
} from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	ListCategoryInputType,
	ListCategoryOutputType,
} from "../catalogs.types";

export async function listCategory(
	data: ListCategoryInputType,
): Promise<JsonOk<ListCategoryOutputType>> {
	try {
		const searching = data.searching;
		const search = searching?.search;
		const searchType = searching?.searchType ?? "name";

		let searchCondition;

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
			message: "Category listed successfully",
			data: {
				items,
				query: {
					searching: {
						search,
						searchType,
					}
				}
			},
		});
	} catch (error) {
		throw handleError(error);
	}
}
