import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { address } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	GetAddressInputType,
	GetAddressOutputType,
} from "../addresses.types";

export const getAddress = async (
	data: GetAddressInputType,
): Promise<JsonOk<GetAddressOutputType>> => {
	try {
		const [row] = await db
			.select()
			.from(address)
			.where(
				and(eq(address.id, data.addressId), eq(address.userId, data.userId)),
			);

		if (!row) {
			throw notFoundError("Address not found");
		}

		return jsonOk<GetAddressOutputType>({
			status: HttpStatusCode.OK,
			message: "Address fetched successfully",
			data: {
				address: {
					id: row.id,
					userId: row.userId,
					fullName: row.fullName,
					phone: row.phone,
					street: row.street,
					postalCode: row.postalCode,
					city: row.city,
					state: row.state,
					country: row.country,
					isDefault: row.isDefault,
					createdAt: row.createdAt.toISOString(),
					updatedAt: row.updatedAt.toISOString(),
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
