import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { address } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	CreateAddressInputType,
	CreateAddressOutputType,
} from "../addresses.types";

export const createAddress = async (
	data: CreateAddressInputType,
): Promise<JsonOk<CreateAddressOutputType>> => {
	try {
		const {
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

		const createdAddress = await db.transaction(async (tx) => {
			if (isDefault) {
				await tx
					.update(address)
					.set({ isDefault: false })
					.where(eq(address.userId, userId));
			}

			const [row] = await tx
				.insert(address)
				.values({
					userId,
					fullName,
					phone,
					street,
					postalCode,
					city,
					state: state ?? null,
					country,
					isDefault,
				})
				.returning();

			return row;
		});

		return jsonOk<CreateAddressOutputType>({
			status: HttpStatusCode.CREATED,
			message: "Address created successfully",
			data: {
				address: {
					id: createdAddress.id,
					userId: createdAddress.userId,
					fullName: createdAddress.fullName,
					phone: createdAddress.phone,
					street: createdAddress.street,
					postalCode: createdAddress.postalCode,
					city: createdAddress.city,
					state: createdAddress.state,
					country: createdAddress.country,
					isDefault: createdAddress.isDefault,
					createdAt: createdAddress.createdAt.toISOString(),
					updatedAt: createdAddress.updatedAt.toISOString(),
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
