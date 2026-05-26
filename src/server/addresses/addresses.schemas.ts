import { z } from "zod";

const addressFieldsSchema = {
	fullName: z
		.string()
		.trim()
		.min(1, "Full name is required")
		.max(100, "Full name cannot be longer than 100 characters"),
	phone: z
		.string()
		.trim()
		.min(1, "Phone is required")
		.max(30, "Phone cannot be longer than 30 characters"),
	street: z
		.string()
		.trim()
		.min(1, "Street is required")
		.max(200, "Street cannot be longer than 200 characters"),
	postalCode: z
		.string()
		.trim()
		.min(1, "Postal code is required")
		.max(20, "Postal code cannot be longer than 20 characters"),
	city: z
		.string()
		.trim()
		.min(1, "City is required")
		.max(100, "City cannot be longer than 100 characters"),
	state: z
		.string()
		.trim()
		.max(100, "State cannot be longer than 100 characters")
		.optional(),
	country: z
		.string()
		.trim()
		.min(1, "Country is required")
		.max(100, "Country cannot be longer than 100 characters"),
};

export const createAddressSchema = z.object({
	...addressFieldsSchema,
	isDefault: z.boolean().default(false),
});

export const listAddressesSchema = z.object({});

export const getAddressSchema = z.object({
	addressId: z.uuid("Address id must be a valid UUID"),
});

export const updateAddressSchema = z.object({
	addressId: z.uuid("Address id must be a valid UUID"),
	fullName: addressFieldsSchema.fullName.optional(),
	phone: addressFieldsSchema.phone.optional(),
	street: addressFieldsSchema.street.optional(),
	postalCode: addressFieldsSchema.postalCode.optional(),
	city: addressFieldsSchema.city.optional(),
	state: addressFieldsSchema.state,
	country: addressFieldsSchema.country.optional(),
	isDefault: z.boolean().optional(),
});

export const deleteAddressSchema = z.object({
	addressId: z.uuid("Address id must be a valid UUID"),
});

export const setDefaultAddressSchema = z.object({
	addressId: z.uuid("Address id must be a valid UUID"),
});
