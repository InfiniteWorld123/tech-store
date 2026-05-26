import { inArray } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { screenSize } from "#/db/schema";
import { badRequestError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	DeleteScreensInputType,
	DeleteScreensOutputType,
} from "../screens.types";

export const deleteScreens = async (
	data: DeleteScreensInputType,
): Promise<JsonOk<DeleteScreensOutputType>> => {
	try {
		const { screenIds } = data;

		const deletedScreens = await db
			.delete(screenSize)
			.where(inArray(screenSize.id, screenIds))
			.returning();

		if (deletedScreens.length === 0) {
			throw badRequestError("Screen sizes deletion failed");
		}

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Screen sizes deleted successfully",
			data: {
				screenIds: deletedScreens.map((item) => item.id),
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
