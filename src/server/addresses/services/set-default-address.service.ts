import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { address } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	SetDefaultAddressInputType,
	SetDefaultAddressOutputType,
} from "../addresses.types";

export const setDefaultAddress = async (
	data: SetDefaultAddressInputType,
): Promise<JsonOk<SetDefaultAddressOutputType>> => {
	try {
		const { addressId, userId } = data;

		const [existingAddress] = await db
			.select({ id: address.id })
			.from(address)
			.where(and(eq(address.id, addressId), eq(address.userId, userId)));

		if (!existingAddress) {
			throw notFoundError("Address not found");
		}

		await db
			.update(address)
			.set({ isDefault: false })
			.where(eq(address.userId, userId));

		const [updatedAddress] = await db
			.update(address)
			.set({ isDefault: true })
			.where(eq(address.id, addressId))
			.returning();

		return jsonOk<SetDefaultAddressOutputType>({
			status: HttpStatusCode.OK,
			message: "Default address updated successfully",
			data: {
				address: {
					id: updatedAddress.id,
					userId: updatedAddress.userId,
					fullName: updatedAddress.fullName,
					phone: updatedAddress.phone,
					street: updatedAddress.street,
					postalCode: updatedAddress.postalCode,
					city: updatedAddress.city,
					state: updatedAddress.state,
					country: updatedAddress.country,
					isDefault: updatedAddress.isDefault,
					createdAt: updatedAddress.createdAt.toISOString(),
					updatedAt: updatedAddress.updatedAt.toISOString(),
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
