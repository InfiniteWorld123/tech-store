import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { address } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	DeleteAddressInputType,
	DeleteAddressOutputType,
} from "../addresses.types";

export const deleteAddress = async (
	data: DeleteAddressInputType,
): Promise<JsonOk<DeleteAddressOutputType>> => {
	try {
		const { addressId, userId } = data;

		const [existingAddress] = await db
			.select({ id: address.id })
			.from(address)
			.where(and(eq(address.id, addressId), eq(address.userId, userId)));

		if (!existingAddress) {
			throw notFoundError("Address not found");
		}

		await db.delete(address).where(eq(address.id, addressId));

		return jsonOk<DeleteAddressOutputType>({
			status: HttpStatusCode.OK,
			message: "Address deleted successfully",
			data: {
				addressId,
				deleted: true,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
