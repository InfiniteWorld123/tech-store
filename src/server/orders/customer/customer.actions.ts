import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import {
	cancelOrderSchema,
	estimateOrderTotalSchema,
	getCustomerOrderDetailSchema,
	getOrderTrackingSchema,
	listCustomerOrdersSchema,
	placeOrderFromCartSchema,
	reorderOrderSchema,
} from "./customer.schemas";
import { cancelOrder } from "./services/cancel-order.service";
import { estimateOrderTotal } from "./services/estimate-order-total.service";
import { getCustomerOrderDetail } from "./services/get-customer-order-detail.service";
import { getOrderTracking } from "./services/get-order-tracking.service";
import { listCustomerOrders } from "./services/list-customer-orders.service";
import { placeOrderFromCart } from "./services/place-order-from-cart.service";
import { reorderOrder } from "./services/reorder-order.service";

export const estimateOrderTotalAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(estimateOrderTotalSchema)
	.handler(async ({ data, context }) => {
		return estimateOrderTotal({
			...data,
			userId: context.session.user.id,
		});
	});

export const placeOrderFromCartAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(placeOrderFromCartSchema)
	.handler(async ({ data, context }) => {
		return placeOrderFromCart({
			...data,
			userId: context.session.user.id,
		});
	});

export const listCustomerOrdersAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(listCustomerOrdersSchema)
	.handler(async ({ data, context }) => {
		return listCustomerOrders({
			...data,
			userId: context.session.user.id,
		});
	});

export const getCustomerOrderDetailAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(getCustomerOrderDetailSchema)
	.handler(async ({ data, context }) => {
		return getCustomerOrderDetail({
			...data,
			userId: context.session.user.id,
		});
	});

export const cancelOrderAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(cancelOrderSchema)
	.handler(async ({ data, context }) => {
		return cancelOrder({
			...data,
			userId: context.session.user.id,
		});
	});

export const getOrderTrackingAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(getOrderTrackingSchema)
	.handler(async ({ data, context }) => {
		return getOrderTracking({
			...data,
			userId: context.session.user.id,
		});
	});

export const reorderOrderAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(reorderOrderSchema)
	.handler(async ({ data, context }) => {
		return reorderOrder({
			...data,
			userId: context.session.user.id,
		});
	});
