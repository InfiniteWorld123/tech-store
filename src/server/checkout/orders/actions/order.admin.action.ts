import { createServerFn } from "@tanstack/react-start";
import { getAllOrdersValidationSchema, getOrderDetailValidationSchema } from "../validation/order.admin.validation";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import { getAllOrders } from "../services/admin/getAllOrders.service";
import { getOrder } from "../services/admin/getOrder.service";


export const getAllOrdersAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getAllOrdersValidationSchema)
    .handler(({ data }) => {
        return getAllOrders(data)
    })

export const getOrderAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getOrderDetailValidationSchema)
    .handler(({ data }) => {
        return getOrder(data)
    })