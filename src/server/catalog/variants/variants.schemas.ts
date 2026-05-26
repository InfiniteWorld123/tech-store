import { z } from "zod";

const variantBaseSchema = z
	.object({
		sku: z.string().trim().min(1, "Variant SKU is required"),
		price: z.number().nonnegative("Variant price must be 0 or greater"),
		compareAtPrice: z
			.number()
			.nonnegative("Compare-at price must be 0 or greater")
			.nullable()
			.optional(),
		stockQuantity: z
			.number()
			.int("Stock quantity must be an integer")
			.nonnegative("Stock quantity must be 0 or greater")
			.default(0),
		colorId: z
			.string()
			.uuid("Color id must be a valid UUID")
			.nullable()
			.optional(),
		storageId: z
			.string()
			.uuid("Storage id must be a valid UUID")
			.nullable()
			.optional(),
		ramId: z.string().uuid("RAM id must be a valid UUID").nullable().optional(),
		screenSizeId: z
			.string()
			.uuid("Screen size id must be a valid UUID")
			.nullable()
			.optional(),
		isDefault: z.boolean().default(false),
		images: z
			.array(z.string().trim().min(1, "Variant image is required"))
			.min(1, "At least one variant image is required"),
	})
	.refine(
		(value) =>
			value.compareAtPrice === undefined ||
			value.compareAtPrice === null ||
			value.compareAtPrice >= value.price,
		{
			message: "Compare-at price cannot be less than the variant price",
			path: ["compareAtPrice"],
		},
	);

export const createVariantSchema = variantBaseSchema.extend({
	productId: z.string().uuid("Product id must be a valid UUID"),
});

export const updateVariantSchema = z
	.object({
		variantId: z.string().uuid("Variant id must be a valid UUID"),
		sku: z.string().trim().min(1, "Variant SKU is required").optional(),
		price: z
			.number()
			.nonnegative("Variant price must be 0 or greater")
			.optional(),
		compareAtPrice: z
			.number()
			.nonnegative("Compare-at price must be 0 or greater")
			.nullable()
			.optional(),
		stockQuantity: z
			.number()
			.int("Stock quantity must be an integer")
			.nonnegative("Stock quantity must be 0 or greater")
			.optional(),
		colorId: z
			.string()
			.uuid("Color id must be a valid UUID")
			.nullable()
			.optional(),
		storageId: z
			.string()
			.uuid("Storage id must be a valid UUID")
			.nullable()
			.optional(),
		ramId: z.string().uuid("RAM id must be a valid UUID").nullable().optional(),
		screenSizeId: z
			.string()
			.uuid("Screen size id must be a valid UUID")
			.nullable()
			.optional(),
		isDefault: z.boolean().optional(),
		images: z
			.array(z.string().trim().min(1, "Variant image is required"))
			.min(1, "At least one variant image is required")
			.optional(),
	})
	.refine(
		(value) =>
			value.compareAtPrice === undefined ||
			value.price === undefined ||
			value.compareAtPrice === null ||
			value.compareAtPrice >= value.price,
		{
			message: "Compare-at price cannot be less than the variant price",
			path: ["compareAtPrice"],
		},
	);

export const deleteVariantSchema = z.object({
	variantId: z.string().uuid("Variant id must be a valid UUID"),
});
