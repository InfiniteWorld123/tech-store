import { inArray } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { color } from "#/db/schema";
import { badRequestError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	DeleteColorsInputType,
	DeleteColorsOutputType,
} from "../colors.types";

export const deleteColors = async (
	data: DeleteColorsInputType,
): Promise<JsonOk<DeleteColorsOutputType>> => {
	try {
		const { colorIds } = data;

		const deletedColors = await db
			.delete(color)
			.where(inArray(color.id, colorIds))
			.returning();

		if (deletedColors.length === 0) {
			throw badRequestError("Colors deletion failed");
		}

		return jsonOk<DeleteColorsOutputType>({
			status: HttpStatusCode.OK,
			message: "Colors deleted successfully",
			data: {
				colorIds: deletedColors.map((item) => item.id),
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
