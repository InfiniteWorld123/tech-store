import { z } from "zod";

export const createRamSchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters"),
	valueGb: z
		.number()
		.int("RAM value must be an integer")
		.positive("RAM value must be greater than 0"),
});

export const deleteRamSchema = z.object({
	ramId: z.uuid("Ram id must be a valid UUID"),
});

export const deleteRamsSchema = z.object({
	ramIds: z.array(z.uuid("Ram id must be a valid UUID")).min(1),
});

export const updateRamSchema = z
	.object({
		ramId: z.uuid("Ram id must be a valid UUID"),
		name: z
			.string()
			.trim()
			.min(2, "Name must be at least 2 characters")
			.optional(),
		valueGb: z
			.number()
			.int("RAM value must be an integer")
			.positive("RAM value must be greater than 0")
			.optional(),
	})
	.refine((value) => value.name !== undefined || value.valueGb !== undefined, {
		message: "At least one field must be provided",
		path: ["ramId"],
	});

export const listRamsSchema = z.object({
	searching: z
		.object({
			search: z.string().trim().min(1, "Search term is required").optional(),
			searchType: z.enum(["name", "valueGb"]).default("name"),
		})
		.optional(),
});
