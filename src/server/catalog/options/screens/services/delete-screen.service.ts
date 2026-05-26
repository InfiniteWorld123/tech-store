import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { screenSize } from "#/db/schema";
import { badRequestError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	DeleteScreenInputType,
	DeleteScreenOutputType,
} from "../screens.types";

export const deleteScreen = async (
	data: DeleteScreenInputType,
): Promise<JsonOk<DeleteScreenOutputType>> => {
	try {
		const { screenId } = data;

		const [existingScreenSize] = await db
			.select({
				id: screenSize.id,
			})
			.from(screenSize)
			.where(eq(screenSize.id, screenId));

		if (!existingScreenSize) {
			throw notFoundError("Screen size not found");
		}

		const [deletedScreenSize] = await db
			.delete(screenSize)
			.where(eq(screenSize.id, screenId))
			.returning();

		if (!deletedScreenSize) {
			throw badRequestError("Screen size deletion failed");
		}
		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Screen size deleted successfully",
			data: {
				screenId: deletedScreenSize.id,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
