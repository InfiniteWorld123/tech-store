import type { z } from "zod";
import type {
	createAddressSchema,
	deleteAddressSchema,
	getAddressSchema,
	setDefaultAddressSchema,
	updateAddressSchema,
} from "./addresses.schemas";

export type AddressType = {
	id: string;
	userId: string;
	fullName: string;
	phone: string;
	street: string;
	postalCode: string;
	city: string;
	state: string | null;
	country: string;
	isDefault: boolean;
	createdAt: string;
	updatedAt: string;
};

export type CreateAddressInputType = z.infer<typeof createAddressSchema> & {
	userId: string;
};

export type ListAddressesInputType = {
	userId: string;
};

export type GetAddressInputType = z.infer<typeof getAddressSchema> & {
	userId: string;
};

export type UpdateAddressInputType = z.infer<typeof updateAddressSchema> & {
	userId: string;
};

export type DeleteAddressInputType = z.infer<typeof deleteAddressSchema> & {
	userId: string;
};

export type SetDefaultAddressInputType = z.infer<
	typeof setDefaultAddressSchema
> & {
	userId: string;
};

export type CreateAddressOutputType = {
	address: AddressType;
};

export type ListAddressesOutputType = {
	items: AddressType[];
};

export type GetAddressOutputType = {
	address: AddressType;
};

export type UpdateAddressOutputType = {
	address: AddressType;
};

export type DeleteAddressOutputType = {
	addressId: string;
	deleted: boolean;
};

export type SetDefaultAddressOutputType = {
	address: AddressType;
};
