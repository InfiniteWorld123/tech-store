import { inArray } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { ram } from "#/db/schema";
import { badRequestError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type { DeleteRamsInputType, DeleteRamsOutputType } from "../rams.types";

export const deleteRams = async (
	data: DeleteRamsInputType,
): Promise<JsonOk<DeleteRamsOutputType>> => {
	try {
		const { ramIds } = data;

		const deletedRams = await db
			.delete(ram)
			.where(inArray(ram.id, ramIds))
			.returning();

		if (deletedRams.length === 0) {
			throw badRequestError("RAMs deletion failed");
		}

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "RAMs deleted successfully",
			data: {
				ramIds: deletedRams.map((item) => item.id),
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
