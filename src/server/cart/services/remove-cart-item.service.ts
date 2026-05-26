import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { cart, cartItem } from "#/db/schema";
import { notFoundError, unauthorizedError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	RemoveCartItemInputType,
	RemoveCartItemOutputType,
} from "../cart.types";
import { getCart } from "./get-cart.service";

export const removeCartItem = async (
	data: RemoveCartItemInputType,
): Promise<JsonOk<RemoveCartItemOutputType>> => {
	try {
		const { userId, sessionId, cartItemId } = data;

		if (!userId && !sessionId) {
			throw unauthorizedError("Cart owner is required");
		}

		const cartOwnerCondition = userId
			? eq(cart.userId, userId)
			: eq(cart.sessionId, sessionId as string);

		const [existingCartItem] = await db
			.select({
				id: cartItem.id,
			})
			.from(cartItem)
			.innerJoin(cart, eq(cart.id, cartItem.cartId))
			.where(and(cartOwnerCondition, eq(cartItem.id, cartItemId)));

		if (!existingCartItem) {
			throw notFoundError("Cart item not found");
		}

		await db.delete(cartItem).where(eq(cartItem.id, existingCartItem.id));

		const cartResponse = await getCart({ userId, sessionId });

		return jsonOk<RemoveCartItemOutputType>({
			status: HttpStatusCode.OK,
			message: "Cart item removed successfully",
			data: cartResponse.data,
		});
	} catch (error) {
		throw handleError(error);
	}
};
