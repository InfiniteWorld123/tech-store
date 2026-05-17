import { and, eq, ne } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { screenSize } from "#/db/schema";
import {
	badRequestError,
	conflictError,
	notFoundError,
} from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	UpdateScreenInputType,
	UpdateScreenOutputType,
} from "../screens.types";

export async function updateScreen(
	data: UpdateScreenInputType,
): Promise<JsonOk<UpdateScreenOutputType>> {
	try {
		const { screenId, name, valueInches } = data;

		const [existingScreen] = await db
			.select({ id: screenSize.id })
			.from(screenSize)
			.where(eq(screenSize.id, screenId));

		if (!existingScreen) {
			throw notFoundError("Screen size not found");
		}

		if (name !== undefined) {
			const [screenWithName] = await db
				.select({ id: screenSize.id })
				.from(screenSize)
				.where(and(eq(screenSize.name, name), ne(screenSize.id, screenId)));

			if (screenWithName) {
				throw conflictError("Screen size name already exists");
			}
		}

		if (valueInches !== undefined) {
			const [screenWithValueInches] = await db
				.select({ id: screenSize.id })
				.from(screenSize)
				.where(
					and(
						eq(screenSize.valueInches, String(valueInches)),
						ne(screenSize.id, screenId),
					),
				);

			if (screenWithValueInches) {
				throw conflictError("Screen size value already exists");
			}
		}

		const updateFields = {
			...(name !== undefined ? { name } : {}),
			...(valueInches !== undefined
				? { valueInches: String(valueInches) }
				: {}),
		};

		if (Object.keys(updateFields).length === 0) {
			throw badRequestError("At least one field must be provided");
		}

		const [updatedScreen] = await db
			.update(screenSize)
			.set(updateFields)
			.where(eq(screenSize.id, screenId))
			.returning();

		if (!updatedScreen) {
			throw badRequestError("Screen size update failed");
		}

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Screen size updated successfully",
			data: {
				id: updatedScreen.id,
				name: updatedScreen.name,
				valueInches: Number(updatedScreen.valueInches),
				createdAt: updatedScreen.createdAt.toISOString(),
				updatedAt: updatedScreen.updatedAt.toISOString(),
			},
		});
	} catch (error) {
		throw handleError(error);
	}
}
