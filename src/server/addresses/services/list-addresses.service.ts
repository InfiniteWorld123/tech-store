import { desc, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { address } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	ListAddressesInputType,
	ListAddressesOutputType,
} from "../addresses.types";

export const listAddresses = async (
	data: ListAddressesInputType,
): Promise<JsonOk<ListAddressesOutputType>> => {
	try {
		const rows = await db
			.select()
			.from(address)
			.where(eq(address.userId, data.userId))
			.orderBy(desc(address.isDefault), desc(address.createdAt));

		return jsonOk<ListAddressesOutputType>({
			status: HttpStatusCode.OK,
			message: "Addresses fetched successfully",
			data: {
				items: rows.map((row) => ({
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
				})),
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
