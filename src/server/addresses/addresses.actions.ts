import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import {
	createAddressSchema,
	deleteAddressSchema,
	getAddressSchema,
	listAddressesSchema,
	setDefaultAddressSchema,
	updateAddressSchema,
} from "./addresses.schemas";
import { createAddress } from "./services/create-address.service";
import { deleteAddress } from "./services/delete-address.service";
import { getAddress } from "./services/get-address.service";
import { listAddresses } from "./services/list-addresses.service";
import { setDefaultAddress } from "./services/set-default-address.service";
import { updateAddress } from "./services/update-address.service";

export const createAddressAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(createAddressSchema)
	.handler(async ({ context, data }) => {
		return createAddress({
			...data,
			userId: context.session.user.id,
		});
	});

export const listAddressesAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(listAddressesSchema)
	.handler(async ({ context, data }) => {
		return listAddresses({
			...data,
			userId: context.session.user.id,
		});
	});

export const getAddressAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(getAddressSchema)
	.handler(async ({ context, data }) => {
		return getAddress({
			...data,
			userId: context.session.user.id,
		});
	});

export const updateAddressAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(updateAddressSchema)
	.handler(async ({ context, data }) => {
		return updateAddress({
			...data,
			userId: context.session.user.id,
		});
	});

export const deleteAddressAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(deleteAddressSchema)
	.handler(async ({ context, data }) => {
		return deleteAddress({
			...data,
			userId: context.session.user.id,
		});
	});

export const setDefaultAddressAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(setDefaultAddressSchema)
	.handler(async ({ context, data }) => {
		return setDefaultAddress({
			...data,
			userId: context.session.user.id,
		});
	});
