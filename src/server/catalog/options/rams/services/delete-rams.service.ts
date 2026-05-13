import { HttpStatusCode } from "#/constants/http"
import { jsonOk, type JsonOk } from "#/constants/json"
import { db } from "#/db/drizzle"
import { handleError } from "#/errors/error-handler"
import { inArray } from "drizzle-orm"
import type { DeleteRamsInputType, DeleteRamsOutputType } from "../rams.types"
import { ram } from "#/db/schema"
import { badRequestError } from "#/errors/app-error"






export async function deleteRams(
	data: DeleteRamsInputType
): Promise<JsonOk<DeleteRamsOutputType>> {
	try {
		const { ramIds } = data

		const deletedRams = await db
			.delete(ram)
			.where(inArray(ram.id, ramIds))
			.returning()

		if (deletedRams.length === 0) {
			throw badRequestError("RAMs deletion failed");
		}

		const items = deletedRams.map((item) => ({
			id: item.id,
			name: item.name,
			valueGb: item.valueGb,
			createdAt: item.createdAt.toISOString(),
			updatedAt: item.updatedAt.toISOString(),
		}));

		return jsonOk({
			status: HttpStatusCode.OK,
			message: `RAMs deletion succeed`,
			data: {
				rams: items
			}
		})
	} catch (error) {
		throw handleError(error)
	}
}