import { z } from "zod";

export const createScreenSchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters"),
	valueInches: z.number().positive("Screen size must be greater than 0"),
});

export const deleteScreenSchema = z.object({
	screenId: z.uuid("Screen id must be a valid UUID"),
});

export const deleteScreensSchema = z.object({
	screenIds: z.array(z.uuid("Screen id must be a valid UUID")).min(1),
});

export const listScreensSchema = z.object({
	searching: z
		.object({
			search: z.string().trim().min(1, "Search term is required").optional(),
			searchType: z.enum(["name", "valueInches"]).default("name"),
		})
		.optional(),
});

export const updateScreenSchema = z
	.object({
		screenId: z.uuid("Screen id must be a valid UUID"),
		name: z
			.string()
			.trim()
			.min(2, "Name must be at least 2 characters")
			.optional(),
		valueInches: z
			.number()
			.positive("Screen size must be greater than 0")
			.optional(),
	})
	.refine(
		(value) => value.name !== undefined || value.valueInches !== undefined,
		{
			message: "At least one field must be provided",
			path: ["screenId"],
		},
	);
