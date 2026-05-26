import { eq, or } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { ram } from "#/db/schema";
import { badRequestError, conflictError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type { CreateRamInputType, CreateRamOutputType } from "../rams.types";

export const createRam = async (
	data: CreateRamInputType,
): Promise<JsonOk<CreateRamOutputType>> => {
	try {
		const { name, valueGb } = data;

		const existingRams = await db
			.select({
				name: ram.name,
				valueGb: ram.valueGb,
			})
			.from(ram)
			.where(or(eq(ram.name, name), eq(ram.valueGb, valueGb)));

		if (existingRams.some((item) => item.name === name)) {
			throw conflictError("RAM name already exists");
		}

		if (existingRams.some((item) => item.valueGb === valueGb)) {
			throw conflictError("RAM value already exists");
		}

		const [createdRam] = await db
			.insert(ram)
			.values({
				name,
				valueGb,
			})
			.returning();

		if (!createdRam) {
			throw badRequestError("Ram is not created");
		}

		return jsonOk({
			status: HttpStatusCode.CREATED,
			message: "RAM created successfully",
			data: {
				ram: {
					id: createdRam.id,
					name: createdRam.name,
					valueGb: createdRam.valueGb,
					createdAt: createdRam.createdAt.toISOString(),
					updatedAt: createdRam.updatedAt.toISOString(),
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
