import { createServerFn } from "@tanstack/react-start";
import { unauthorizedError } from "#/errors/app-error";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import { estimateOrderTotalValidationSchema, getCustomerOrderDetailValidationSchema, listCustomerOrdersValidationSchema, placeOrderFromCartValidationSchema } from "./customer.schemas";
import { estimateOrderTotal } from "./services/estimate-order-total.service";
import { placeOrderFromCart } from "./services/place-order-from-cart.service";
import { listCustomerOrders } from "./services/list-customer-orders.service";
import { getCustomerOrderDetail } from "./services/get-customer-order-detail.service";

export const estimateOrderTotalAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(estimateOrderTotalValidationSchema)
    .handler(async ({ data, context }) => {
        if (!context.session) {
            throw unauthorizedError("user is unauthorized");
        }

        return estimateOrderTotal({
            ...data,
            userId: context.session.user.id,
        });
    });

export const placeOrderFromCartAction = createServerFn({ method: "POST" })
    .middleware([ensureSession])
    .inputValidator(placeOrderFromCartValidationSchema)
    .handler(async ({ data, context }) => {
        return placeOrderFromCart({
            ...data,
            userId: context.session?.user.id as string,
        })
    })

export const listCustomerOrdersAction = createServerFn({ method: "POST" })
    .middleware([ensureSession])
    .inputValidator(listCustomerOrdersValidationSchema)
    .handler(async ({ data, context }) => {
        return listCustomerOrders({
            ...data,
            userId: context.session?.user.id as string,
        })
    })

export const getCustomerOrderDetailAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getCustomerOrderDetailValidationSchema)
    .handler(async ({ data, context }) => {
        return getCustomerOrderDetail({
            ...data,
            userId: context.session?.user.id as string,
        })
    })