import { createServerFn } from "@tanstack/react-start";
import { getAllOrdersValidationSchema } from "../validation/order.admin.validation";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import { getAllOrders } from "../services/admin/getAllOrders.service";


export const getAllOrdersAction = createServerFn({ method: "GET" })
    .middleware([ensureSession])
    .inputValidator(getAllOrdersValidationSchema)
    .handler(({ data }) => {
        return getAllOrders(data)
    })