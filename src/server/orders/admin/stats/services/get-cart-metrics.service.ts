import { HttpStatusCode } from "#/constants/http";
import { jsonOk, type JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { cart, cartItem } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type { GetCartMetricsInputType, GetCartMetricsOutputType } from "../stats.types";
import { sql, count } from "drizzle-orm";


export const getCartMetrics = async (
    _data: GetCartMetricsInputType
): Promise<JsonOk<GetCartMetricsOutputType>> => {
    try {

        const [cartMetrics] = await db
            .select({
                totalCarts: count(),
                guestCarts: sql<number>`count(*) filter (where ${cart.sessionId} is not null)`,
                userCarts: sql<number>`count(*) filter (where ${cart.userId} is not null)`,
                emptyCarts: sql<number>
                    `count(*) filter (where ${cart.id} not in (select cart_id from "cart_item"))`, 
                    totalItemsInCarts: sql<number>`sum(${cartItem.quantity})`,
                averageCartValue: sql<number>`avg(${cartItem.priceAtTime} * ${cartItem.quantity})`,
                averageItemsPerCart: sql<number>`avg(item_count) from (select sum(${cartItem.quantity}) as item_count 
                from ${cartItem} group by ${cartItem.cartId}) as sub --`,
                activeCarts: sql<number>`count(distinct ${cartItem.cartId})`,
            })
            .from(cart)


        return jsonOk({
            status: HttpStatusCode.OK,
            message: "Cart metrics order successfully fetched",
            data: {
                totalCarts: cartMetrics.totalCarts,
                guestCarts: cartMetrics.guestCarts,
                userCarts: cartMetrics.userCarts,
                emptyCarts: cartMetrics.emptyCarts,
                activeCarts: cartMetrics.activeCarts,
                totalItemsInCarts: cartMetrics.totalItemsInCarts,
                averageItemsPerCart: cartMetrics.averageItemsPerCart,
                averageCartValue: cartMetrics.averageCartValue,
            }
        })
    } catch (error) {
        throw handleError(error)
    }
}