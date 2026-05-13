import { HttpStatusCode } from "#/constants/http";
import { jsonOk, type JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { color } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import { and, eq, ne } from "drizzle-orm";
import type { UpdateColorInputType, UpdateColorOutputType } from "../colors.types";
import { badRequestError, conflictError, notFoundError } from "#/errors/app-error";

export async function updateColor(data: UpdateColorInputType)
	: Promise<JsonOk<UpdateColorOutputType>> {
	try {
		const { colorId, name, hexCode } = data

		const [existingColor] = await db
			.select({ id: color.id })
			.from(color)
			.where(eq(color.id, colorId));

		if (!existingColor) {
			throw notFoundError("Color not found");
		}

		if (name !== undefined) {
			const [colorWithName] = await db
				.select({ id: color.id })
				.from(color)
				.where(and(eq(color.name, name), ne(color.id, colorId)));

			if (colorWithName) {
				throw conflictError("Color name already exists");
			}
		}

		if (hexCode !== undefined && hexCode !== null) {
			const [colorWithHexCode] = await db
				.select({ id: color.id })
				.from(color)
				.where(and(eq(color.hexCode, hexCode), ne(color.id, colorId)));

			if (colorWithHexCode) {
				throw conflictError("Color hex code already exists");
			}
		}

		const updateFields = {
			...(name !== undefined ? { name } : {}),
			...(hexCode !== undefined ? { hexCode } : {}),
		};

		if (Object.keys(updateFields).length === 0) {
			throw badRequestError("At least one field must be provided");
		}

		const [updatedColor] = await db
			.update(color)
			.set(updateFields)
			.where(eq(color.id, colorId))
			.returning();

		if (!updatedColor) {
			throw badRequestError("Color update failed");
		}

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Color updated successfully",
			data: {
				id: updatedColor.id,
				name: updatedColor.name,
				hexCode: updatedColor.hexCode ?? null,
				createdAt: updatedColor.createdAt.toISOString(),
				updatedAt: updatedColor.updatedAt.toISOString(),
			},
		});

	} catch (error) {
		throw handleError(error)
	}
}
