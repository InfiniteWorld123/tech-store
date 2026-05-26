import { eq, or } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { color } from "#/db/schema";
import { badRequestError, conflictError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	CreateColorInputType,
	CreateColorOutputType,
} from "../colors.types";

export const createColor = async (
	data: CreateColorInputType,
): Promise<JsonOk<CreateColorOutputType>> => {
	try {
		const { name, hexCode } = data;

		const duplicateConditions = [eq(color.name, name)];

		if (hexCode !== undefined && hexCode !== null) {
			duplicateConditions.push(eq(color.hexCode, hexCode));
		}

		const existingColors = await db
			.select({
				name: color.name,
				hexCode: color.hexCode,
			})
			.from(color)
			.where(or(...duplicateConditions));

		if (existingColors.some((item) => item.name === name)) {
			throw conflictError("Color name already exists");
		}

		if (
			hexCode != null &&
			existingColors.some((item) => item.hexCode === hexCode)
		) {
			throw conflictError("Color hex code already exists");
		}

		const [createdColor] = await db
			.insert(color)
			.values({
				name,
				hexCode,
			})
			.returning();

		if (!createdColor) {
			throw badRequestError("Color creation failed");
		}

		return jsonOk({
			data: {
				color: {
					id: createdColor.id,
					name: createdColor.name,
					hexCode: createdColor.hexCode,
					createdAt: createdColor.createdAt.toISOString(),
					updatedAt: createdColor.updatedAt.toISOString(),
				},
			},
			status: HttpStatusCode.CREATED,
			message: "Color created successfully",
		});
	} catch (error) {
		throw handleError(error);
	}
};
