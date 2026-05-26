import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { cart, cartItem } from "#/db/schema";
import { unauthorizedError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type { ClearCartInputType, ClearCartOutputType } from "../cart.types";
import { getCart } from "./get-cart.service";

export const clearCart = async (
	data: ClearCartInputType,
): Promise<JsonOk<ClearCartOutputType>> => {
	try {
		const { userId, sessionId } = data;

		if (!userId && !sessionId) {
			throw unauthorizedError("Cart owner is required");
		}

		const cartOwnerCondition = userId
			? eq(cart.userId, userId)
			: eq(cart.sessionId, sessionId as string);

		const [existingCart] = await db
			.select({
				cartId: cart.id,
				userId: cart.userId,
				sessionId: cart.sessionId,
			})
			.from(cart)
			.where(cartOwnerCondition);

		if (!existingCart) {
			return getCart({ userId, sessionId });
		}

		await db.delete(cartItem).where(eq(cartItem.cartId, existingCart.cartId));

		const cartResponse = await getCart({ userId, sessionId });

		return jsonOk<ClearCartOutputType>({
			status: HttpStatusCode.OK,
			message: "Cart cleared successfully",
			data: cartResponse.data,
		});
	} catch (error) {
		throw handleError(error);
	}
};
