import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { address } from "#/db/schema";
import { badRequestError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	UpdateAddressInputType,
	UpdateAddressOutputType,
} from "../addresses.types";

export const updateAddress = async (
	data: UpdateAddressInputType,
): Promise<JsonOk<UpdateAddressOutputType>> => {
	try {
		const {
			addressId,
			city,
			country,
			fullName,
			isDefault,
			phone,
			postalCode,
			state,
			street,
			userId,
		} = data;

		if (
			fullName === undefined &&
			phone === undefined &&
			street === undefined &&
			postalCode === undefined &&
			city === undefined &&
			state === undefined &&
			country === undefined &&
			isDefault === undefined
		) {
			throw badRequestError("At least one address field must be updated");
		}

		const updatedAddress = await db.transaction(async (tx) => {
			const [existingAddress] = await tx
				.select({ id: address.id })
				.from(address)
				.where(and(eq(address.id, addressId), eq(address.userId, userId)));

			if (!existingAddress) {
				throw notFoundError("Address not found");
			}

			if (isDefault === true) {
				await tx
					.update(address)
					.set({ isDefault: false })
					.where(eq(address.userId, userId));
			}

			const [row] = await tx
				.update(address)
				.set({
					...(fullName !== undefined ? { fullName } : {}),
					...(phone !== undefined ? { phone } : {}),
					...(street !== undefined ? { street } : {}),
					...(postalCode !== undefined ? { postalCode } : {}),
					...(city !== undefined ? { city } : {}),
					...(state !== undefined ? { state: state ?? null } : {}),
					...(country !== undefined ? { country } : {}),
					...(isDefault !== undefined ? { isDefault } : {}),
				})
				.where(eq(address.id, addressId))
				.returning();

			return row;
		});

		return jsonOk<UpdateAddressOutputType>({
			status: HttpStatusCode.OK,
			message: "Address updated successfully",
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
