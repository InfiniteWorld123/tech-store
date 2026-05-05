import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import {
	getOrderDetailSchema,
	listOrdersSchema,
	toggleOrderArchiveSchema,
	updateOrderPaymentStatusSchema,
	updateOrderShippingStatusSchema,
	updateOrderStatusSchema,
} from "./operational.schemas";
import { getOrderDetail } from "./services/get-order-detail.service";
import { listOrders } from "./services/list-orders.service";
import { toggleOrderArchive } from "./services/toggle-archive-order.service";
import { updateOrderPaymentStatus } from "./services/update-order-payment-status.service";
import { updateOrderShippingStatus } from "./services/update-order-shipping-status.service";
import { updateOrderStatus } from "./services/update-order-status.service";

export const listOrdersAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(listOrdersSchema)
	.handler(async ({ data }) => {
		return listOrders(data);
	});

export const getOrderDetailAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(getOrderDetailSchema)
	.handler(async ({ data }) => {
		return getOrderDetail(data);
	});

export const archiveOrderAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(toggleOrderArchiveSchema)
	.handler(async ({ data }) => {
		return toggleOrderArchive(data);
	});

export const updateOrderStatusAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(updateOrderStatusSchema)
	.handler(async ({ data }) => {
		return updateOrderStatus(data);
	});

export const updateOrderPaymentStatusAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(updateOrderPaymentStatusSchema)
	.handler(async ({ data }) => {
		return updateOrderPaymentStatus(data);
	});

export const updateOrderShippingStatusAction = createServerFn({
	method: "POST",
})
	.middleware([ensureSession])
	.inputValidator(updateOrderShippingStatusSchema)
	.handler(async ({ data }) => {
		return updateOrderShippingStatus(data);
	});
