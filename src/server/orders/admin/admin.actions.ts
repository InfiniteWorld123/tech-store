import { createServerFn } from "@tanstack/react-start";
import { ensureAdmin } from "#/server/auth/ensure-session.middleware";
import {
	getOrderDetailSchema,
	listOrdersSchema,
	toggleOrderArchiveSchema,
	updateOrderStatusSchema,
} from "./admin.schemas";
import { getOrderDetail } from "./services/get-order-detail.service";
import { listOrders } from "./services/list-orders.service";
import { toggleOrderArchive } from "./services/toggle-archive-order.service";
import { updateOrderStatus } from "./services/update-order-status.service";

export const listOrdersAction = createServerFn({ method: "GET" })
	.middleware([ensureAdmin])
	.inputValidator(listOrdersSchema)
	.handler(async ({ data }) => {
		return listOrders(data);
	});

export const getOrderDetailAction = createServerFn({ method: "GET" })
	.middleware([ensureAdmin])
	.inputValidator(getOrderDetailSchema)
	.handler(async ({ data }) => {
		return getOrderDetail(data);
	});

export const archiveOrderAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(toggleOrderArchiveSchema)
	.handler(async ({ data }) => {
		return toggleOrderArchive(data);
	});

export const updateOrderStatusAction = createServerFn({ method: "POST" })
	.middleware([ensureAdmin])
	.inputValidator(updateOrderStatusSchema)
	.handler(async ({ data }) => {
		return updateOrderStatus(data);
	});
