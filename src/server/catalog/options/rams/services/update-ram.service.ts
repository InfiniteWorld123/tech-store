import { and, eq, ne } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { ram } from "#/db/schema";
import {
	badRequestError,
	conflictError,
	notFoundError,
} from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type { UpdateRamInputType, UpdateRamOutputType } from "../rams.types";

export const updateRam = async (
	data: UpdateRamInputType,
): Promise<JsonOk<UpdateRamOutputType>> => {
	try {
		const { ramId, name, valueGb } = data;

		const [existingRam] = await db
			.select({
				name: ram.name,
				valueGb: ram.valueGb,
			})
			.from(ram)
			.where(eq(ram.id, ramId));

		if (!existingRam) {
			throw notFoundError(`Ram with id: ${ramId} is not found`);
		}

		if (name !== undefined) {
			const [ramWithName] = await db
				.select({ id: ram.id })
				.from(ram)
				.where(and(eq(ram.name, name), ne(ram.id, ramId)));

			if (ramWithName) {
				throw conflictError(`Ram name already exists`);
			}
		}

		if (valueGb !== undefined) {
			const [ramWithValueGb] = await db
				.select({ id: ram.id })
				.from(ram)
				.where(and(eq(ram.valueGb, valueGb), ne(ram.id, ramId)));

			if (ramWithValueGb) {
				throw conflictError(`Ram value already exists`);
			}
		}

		const updateFields = {
			...(name !== undefined ? { name } : {}),
			...(valueGb !== undefined ? { valueGb } : {}),
		};

		if (Object.keys(updateFields).length === 0) {
			throw badRequestError("At least one field must be provided");
		}

		const [updatedRam] = await db
			.update(ram)
			.set(updateFields)
			.where(eq(ram.id, ramId))
			.returning();

		if (!updatedRam) {
			throw badRequestError("RAM update failed");
		}

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "RAM updated successfully",
			data: {
				ram: {
					id: updatedRam.id,
					name: updatedRam.name,
					valueGb: updatedRam.valueGb,
					createdAt: updatedRam.createdAt.toISOString(),
					updatedAt: updatedRam.updatedAt.toISOString(),
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
