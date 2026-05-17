import { z } from "zod";

export const createStorageSchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters"),
	valueGb: z
		.number()
		.int("Storage value must be an integer")
		.positive("Storage value must be greater than 0"),
});

export const deleteStorageSchema = z.object({
	storageId: z.uuid("Storage id must be a valid UUID"),
});

export const deleteStoragesSchema = z.object({
	storageIds: z.array(z.uuid("Storage id must be a valid UUID")).min(1),
});

export const listStoragesSchema = z.object({
	searching: z
		.object({
			search: z.string().trim().min(1, "Search term is required").optional(),
			searchType: z.enum(["name", "valueGb"]).default("name"),
		})
		.optional(),
});

export const updateStorageSchema = z
	.object({
		storageId: z.uuid("Storage id must be a valid UUID"),
		name: z
			.string()
			.trim()
			.min(2, "Name must be at least 2 characters")
			.optional(),
		valueGb: z
			.number()
			.int("Storage value must be an integer")
			.positive("Storage value must be greater than 0")
			.optional(),
	})
	.refine((value) => value.name !== undefined || value.valueGb !== undefined, {
		message: "At least one field must be provided",
		path: ["storageId"],
	});
