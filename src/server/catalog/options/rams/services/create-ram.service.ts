import { HttpStatusCode } from "#/constants/http";
import { jsonOk, type JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { ram } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import { eq, or } from "drizzle-orm";
import type { CreateRamInputType, CreateRamOutputType } from "../rams.types";
import { badRequestError, conflictError } from "#/errors/app-error";

export async function createRam(
	data: CreateRamInputType
): Promise<JsonOk<CreateRamOutputType>> {
	try {

		const { name, valueGb } = data

		const existingRams = await db
			.select({
				name: ram.name,
				valueGb: ram.valueGb
			})
			.from(ram)
			.where(or(eq(ram.name, name), eq(ram.valueGb, valueGb)))

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
				valueGb
			})
			.returning()

		if (!createdRam) {
			throw badRequestError("Ram is not created")
		}

		return jsonOk({
			status: HttpStatusCode.CREATED,
			message: `RAM name: ${name} with value: ${valueGb} is created successfully`,
			data: {
				id: createdRam.id,
				name: createdRam.name,
				valueGb: createdRam.valueGb,
				createdAt: createdRam.createdAt.toISOString(),
				updatedAt: createdRam.updatedAt.toISOString(),
			}
		})
	} catch (error) {
		throw handleError(error)
	}
}
