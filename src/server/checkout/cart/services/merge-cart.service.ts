import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import type { JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { cart, cartItem } from "#/db/schema";
import { unauthorizedError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type { MergeCartInputType, MergeCartOutputType } from "../cart.types";
import { getCart } from "./get-cart.service";

const mergedCartResponse = async ({
	userId,
	sessionId,
}: {
	userId: string | null;
	sessionId: string | null;
}): Promise<JsonOk<MergeCartOutputType>> => {
	const cartResponse = await getCart({ userId, sessionId });

	return {
		...cartResponse,
		status: HttpStatusCode.OK,
		message: "Cart merged successfully",
	};
};

export const mergeCart = async (
	data: MergeCartInputType,
): Promise<JsonOk<MergeCartOutputType>> => {
	try {
		const { userId, sessionId } = data;

		if (!userId || !sessionId) {
			throw unauthorizedError("Cart owner is required");
		}

		const [existingGuestCart] = await db
			.select({
				id: cart.id,
				sessionId: cart.sessionId,
			})
			.from(cart)
			.where(eq(cart.sessionId, sessionId));

		if (!existingGuestCart) {
			return mergedCartResponse({ userId, sessionId: null });
		}

		const [existingUserCart] = await db
			.select({
				id: cart.id,
				userId: cart.userId,
			})
			.from(cart)
			.where(eq(cart.userId, userId));

		if (!existingUserCart) {
			await db
				.update(cart)
				.set({ userId, sessionId: null })
				.where(eq(cart.id, existingGuestCart.id));

			return mergedCartResponse({ userId, sessionId: null });
		}

		const guestCartItems = await db
			.select({
				id: cartItem.id,
				variantId: cartItem.variantId,
				quantity: cartItem.quantity,
				priceAtTime: cartItem.priceAtTime,
			})
			.from(cartItem)
			.where(eq(cartItem.cartId, existingGuestCart.id));

		for (const guestItem of guestCartItems) {
			const [existingUserCartItem] = await db
				.select({
					id: cartItem.id,
					quantity: cartItem.quantity,
				})
				.from(cartItem)
				.where(
					and(
						eq(cartItem.cartId, existingUserCart.id),
						eq(cartItem.variantId, guestItem.variantId),
					),
				);

			if (existingUserCartItem) {
				await db
					.update(cartItem)
					.set({
						quantity: existingUserCartItem.quantity + guestItem.quantity,
						priceAtTime: guestItem.priceAtTime,
					})
					.where(eq(cartItem.id, existingUserCartItem.id));

				await db.delete(cartItem).where(eq(cartItem.id, guestItem.id));
				continue;
			}

			await db
				.update(cartItem)
				.set({ cartId: existingUserCart.id })
				.where(eq(cartItem.id, guestItem.id));
		}

		await db.delete(cart).where(eq(cart.id, existingGuestCart.id));

		return mergedCartResponse({ userId, sessionId: null });
	} catch (error) {
		throw handleError(error);
	}
};
