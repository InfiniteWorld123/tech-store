import type { JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import { and, eq } from "drizzle-orm";
import type { CancelOrderInputType, CancelOrderOutputType } from "../customer.types";
import { badRequestError, notFoundError } from "#/errors/app-error";
import { getCustomerOrderDetail } from "./get-customer-order-detail.service";

export const cancelOrder = async (
    data: CancelOrderInputType
): Promise<JsonOk<CancelOrderOutputType>> => {
    try {
        const { orderId, userId } = data;

        const [existingOrder] = await db
            .select({
                status: order.status
            })
            .from(order)
            .where(
                and(
                    eq(order.id, orderId),
                    eq(order.userId, userId)
                )
            )

        if (!existingOrder) { throw notFoundError("order not found") }

        if (existingOrder.status === "completed") {
            throw badRequestError("Order cannot be cancelled, because the order is completed")
        }

        if (existingOrder.status === "cancelled") {
            throw badRequestError("Order is already cancelled")
        }

        await db.
            update(order).
            set({ status: "cancelled" }).
            where(
                eq(order.id, orderId)
            )

        return {
            ...await getCustomerOrderDetail({ orderId, userId }),
            message: "Order is cancelled successfully"
        }

    } catch (error) {
        throw handleError(error)
    }
}