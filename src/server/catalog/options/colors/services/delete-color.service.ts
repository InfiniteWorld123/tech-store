import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { color } from "#/db/schema";
import { badRequestError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	DeleteColorInputType,
	DeleteColorOutputType,
} from "../colors.types";

export const deleteColor = async (
	data: DeleteColorInputType,
): Promise<JsonOk<DeleteColorOutputType>> => {
	try {
		const { colorId } = data;

		const [existingColor] = await db
			.select({
				id: color.id,
			})
			.from(color)
			.where(eq(color.id, colorId));

		if (!existingColor) {
			throw notFoundError("Color not found");
		}

		const [deletedColor] = await db
			.delete(color)
			.where(eq(color.id, colorId))
			.returning();

		if (!deletedColor) {
			throw badRequestError("Color deletion failed");
		}

		return jsonOk<DeleteColorOutputType>({
			status: HttpStatusCode.OK,
			message: "Color deleted successfully",
			data: {
				colorId: deletedColor.id,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
