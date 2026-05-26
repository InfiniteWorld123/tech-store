import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { screenSize } from "#/db/schema";
import { badRequestError, conflictError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	CreateScreenInputType,
	CreateScreenOutputType,
} from "../screens.types";

export const createScreen = async (
	data: CreateScreenInputType,
): Promise<JsonOk<CreateScreenOutputType>> => {
	try {
		const { name, valueInches } = data;

		const [existingScreenSizeWithName] = await db
			.select({
				id: screenSize.id,
				name: screenSize.name,
			})
			.from(screenSize)
			.where(eq(screenSize.name, name));

		if (existingScreenSizeWithName) {
			throw conflictError(
				`there is already a screen size with the name: ${name}`,
			);
		}

		const [existingScreenSizeWithValueInches] = await db
			.select({
				id: screenSize.id,
				valueInches: screenSize.valueInches,
			})
			.from(screenSize)
			.where(eq(screenSize.valueInches, String(valueInches)));

		if (existingScreenSizeWithValueInches) {
			throw conflictError(
				`There is already a screen size with the value inch: ${valueInches}`,
			);
		}

		const [createdScreenSize] = await db
			.insert(screenSize)
			.values({
				name,
				valueInches: String(valueInches),
			})
			.returning();

		if (!createdScreenSize) {
			throw badRequestError("failed for creation a screen size");
		}

		return jsonOk({
			status: HttpStatusCode.CREATED,
			message: "Screen size created successfully",
			data: {
				screen: {
					id: createdScreenSize.id,
					name: createdScreenSize.name,
					valueInches: Number(createdScreenSize.valueInches),
					createdAt: createdScreenSize.createdAt.toISOString(),
					updatedAt: createdScreenSize.updatedAt.toISOString(),
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
