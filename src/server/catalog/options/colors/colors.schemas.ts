import { z } from "zod";

export const createColorSchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters"),
	hexCode: z
		.string()
		.trim()
		.min(1, "Hex code is required")
		.nullable()
		.optional(),
});

export const deleteColorSchema = z.object({
	colorId: z.uuid("Color id must be a valid UUID"),
});

export const deleteColorsSchema = z.object({
	colorIds: z.array(z.uuid("Color id must be a valid UUID")).min(1),
});

export const listColorsSchema = z.object({
	searching: z
		.object({
			search: z.string().trim().min(1, "Search term is required").optional(),
			searchType: z.enum(["name", "hexCode"]).default("name"),
		})
		.optional(),
});

export const updateColorSchema = z
	.object({
		colorId: z.string().uuid("Color id must be a valid UUID"),
		name: z
			.string()
			.trim()
			.min(2, "Name must be at least 2 characters")
			.optional(),
		hexCode: z
			.string()
			.trim()
			.min(1, "Hex code is required")
			.nullable()
			.optional(),
	})
	.refine((value) => value.name !== undefined || value.hexCode !== undefined, {
		message: "At least one field must be provided",
		path: ["colorId"],
	});
