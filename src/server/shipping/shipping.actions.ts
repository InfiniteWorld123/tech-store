import { createServerFn } from "@tanstack/react-start";
import { ensureAdmin } from "#/server/auth/ensure-session.middleware";
import { addTrackingNumber } from "./services/add-tracking-number.service";
import { createShipping } from "./services/create-shipping.service";
import { getShipping } from "./services/get-shipping.service";
import { listShipments } from "./services/list-shipments.service";
import { markOrderDelivered } from "./services/mark-order-delivered.service";
import { markOrderShipped } from "./services/mark-order-shipped.service";
import { updateShippingStatus } from "./services/update-shipping-status.service";
import {
	addTrackingNumberSchema,
	createShippingSchema,
	getShippingSchema,
	listShipmentsSchema,
	markOrderDeliveredSchema,
	markOrderShippedSchema,
	updateShippingStatusSchema,
} from "./shipping.schemas";

export const createShippingAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(createShippingSchema)
	.handler(async ({ data }) => {
		return createShipping(data);
	});

export const getShippingAction = createServerFn({ method: "GET" })
	.middleware([ensureAdmin])
	.inputValidator(getShippingSchema)
	.handler(async ({ data }) => {
		return getShipping(data);
	});

export const updateShippingStatusAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(updateShippingStatusSchema)
	.handler(async ({ data }) => {
		return updateShippingStatus(data);
	});

export const addTrackingNumberAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(addTrackingNumberSchema)
	.handler(async ({ data }) => {
		return addTrackingNumber(data);
	});

export const markOrderShippedAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(markOrderShippedSchema)
	.handler(async ({ data }) => {
		return markOrderShipped(data);
	});

export const markOrderDeliveredAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(markOrderDeliveredSchema)
	.handler(async ({ data }) => {
		return markOrderDelivered(data);
	});

export const listShipmentsAction = createServerFn({ method: "GET" })
	.middleware([ensureAdmin])
	.inputValidator(listShipmentsSchema)
	.handler(async ({ data }) => {
		return listShipments(data);
	});
