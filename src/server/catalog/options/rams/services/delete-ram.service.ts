import { HttpStatusCode } from "#/constants/http";
import { jsonOk, type JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { ram } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import { eq } from "drizzle-orm";
import type { DeleteRamInputType, DeleteRamOutputType } from "../rams.types";
import { badRequestError, notFoundError } from "#/errors/app-error";




export async function deleteRam(
	data: DeleteRamInputType
): Promise<JsonOk<DeleteRamOutputType>> {
	try {
		const { ramId } = data

		const [existingRam] = await db
			.select({
				ramId: ram.id
			})
			.from(ram)
			.where(eq(ram.id, ramId))

		if (!existingRam) {
			throw notFoundError(`Ram with ${ramId} does not exist`)
		}

		const [deletedRam] = await db
			.delete(ram)
			.where(eq(ram.id, ramId))
			.returning()

		if (!deletedRam) {
			throw badRequestError(`Failed to delete the RAM with id: ${ramId}`)
		}

		return jsonOk({
			status: HttpStatusCode.OK,
			message: `RAM with id: ${ramId} is deleted successfully`,
			data: {
				id: deletedRam.id,
				name: deletedRam.name,
				valueGb: deletedRam.valueGb,
				createdAt: deletedRam.createdAt.toISOString(),
				updatedAt: deletedRam.updatedAt.toISOString(),
			}
		})
	} catch (error) {
		throw handleError(error)
	}
}
