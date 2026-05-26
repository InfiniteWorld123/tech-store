import { count, sql } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { cart, cartItem } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	GetCartMetricsInputType,
	GetCartMetricsOutputType,
} from "../analytics.types";

export const getCartMetrics = async (
	_data: GetCartMetricsInputType,
): Promise<JsonOk<GetCartMetricsOutputType>> => {
	try {
		const [cartStats] = await db
			.select({
				totalCarts: count(),
				guestCarts: sql<number>`count(*) filter (where ${cart.sessionId} is not null)`,
				userCarts: sql<number>`count(*) filter (where ${cart.userId} is not null)`,
				emptyCarts: sql<number>`count(*) filter (where ${cart.id} not in (select cart_id from ${cartItem}))`,
			})
			.from(cart);

		const [itemStats] = await db
			.select({
				totalItemsInCarts: sql<number>`coalesce(sum(${cartItem.quantity}), 0)`,
				averageCartValue: sql<number>`coalesce(avg(${cartItem.priceAtTime} * ${cartItem.quantity}), 0)`,
				activeCarts: sql<number>`count(distinct ${cartItem.cartId})`,
			})
			.from(cartItem);

		const [avgItemsResult] = await db
			.select({
				averageItemsPerCart: sql<number>`coalesce(avg(item_count), 0)`,
			})
			.from(
				sql`(select sum(${cartItem.quantity}) as item_count from ${cartItem} group by ${cartItem.cartId}) as sub`,
			);

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Cart metrics fetched successfully",
			data: {
				totalCarts: cartStats.totalCarts,
				guestCarts: cartStats.guestCarts,
				userCarts: cartStats.userCarts,
				emptyCarts: cartStats.emptyCarts,
				activeCarts: itemStats.activeCarts,
				totalItemsInCarts: Number(itemStats.totalItemsInCarts ?? 0),
				averageItemsPerCart: Number(avgItemsResult.averageItemsPerCart ?? 0),
				averageCartValue: Number(itemStats.averageCartValue ?? 0),
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
