import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import type { JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { cart, cartItem } from "#/db/schema";
import { unauthorizedError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type { EmptyCartInputType, EmptyCartOutputType } from "../cart.types";
import { getCart } from "./get-cart.service";

export const emptyCart = async (
	data: EmptyCartInputType,
): Promise<JsonOk<EmptyCartOutputType>> => {
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

		return {
			...cartResponse,
			status: HttpStatusCode.OK,
			message: "Cart emptied successfully",
		};
	} catch (error) {
		throw handleError(error);
	}
};
