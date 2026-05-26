import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { ram } from "#/db/schema";
import { badRequestError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type { DeleteRamInputType, DeleteRamOutputType } from "../rams.types";

export const deleteRam = async (
	data: DeleteRamInputType,
): Promise<JsonOk<DeleteRamOutputType>> => {
	try {
		const { ramId } = data;

		const [existingRam] = await db
			.select({
				ramId: ram.id,
			})
			.from(ram)
			.where(eq(ram.id, ramId));

		if (!existingRam) {
			throw notFoundError(`Ram with ${ramId} does not exist`);
		}

		const [deletedRam] = await db
			.delete(ram)
			.where(eq(ram.id, ramId))
			.returning();

		if (!deletedRam) {
			throw badRequestError(`Failed to delete the RAM with id: ${ramId}`);
		}

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "RAM deleted successfully",
			data: {
				ramId: deletedRam.id,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
