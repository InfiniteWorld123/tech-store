import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { cart, cartItem, variant } from "#/db/schema";
import {
	conflictError,
	notFoundError,
	unauthorizedError,
} from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	UpdateCartItemQuantityInputType,
	UpdateCartItemQuantityOutputType,
} from "../cart.types";
import { getCart } from "./get-cart.service";

export const updateCartItemQuantity = async (
	data: UpdateCartItemQuantityInputType,
): Promise<JsonOk<UpdateCartItemQuantityOutputType>> => {
	try {
		const { userId, sessionId, variantId, quantity } = data;

		const cartOwnerCondition = userId
			? eq(cart.userId, userId)
			: eq(cart.sessionId, sessionId as string);

		if (!userId && !sessionId) {
			throw unauthorizedError("Cart owner is required");
		}

		const [existingCartItem] = await db
			.select({
				id: cartItem.id,
				cartId: cartItem.cartId,
				variantId: cartItem.variantId,
				quantity: cartItem.quantity,

				userId: cart.userId,
				sessionId: cart.sessionId,
			})
			.from(cartItem)
			.innerJoin(cart, eq(cart.id, cartItem.cartId))
			.where(and(eq(cartItem.variantId, variantId), cartOwnerCondition));

		if (!existingCartItem) {
			throw notFoundError("Cart item not found");
		}

		const [existingVariant] = await db
			.select({
				stockQuantity: variant.stockQuantity,
				price: variant.price,
			})
			.from(variant)
			.where(eq(variant.id, variantId));

		if (!existingVariant) {
			throw notFoundError("Variant not found");
		}

		if (existingVariant.stockQuantity <= 0) {
			throw conflictError("Out of stock");
		}
		if (existingVariant.stockQuantity < quantity) {
			throw conflictError("Requested quantity exceeds available stock");
		}

		const newQuantity = quantity;

		await db
			.update(cartItem)
			.set({
				quantity: newQuantity,
				priceAtTime: existingVariant.price,
			})
			.where(eq(cartItem.id, existingCartItem.id));

		const cartResponse = await getCart({ userId, sessionId });

		return jsonOk<UpdateCartItemQuantityOutputType>({
			status: HttpStatusCode.OK,
			message: "Cart item quantity updated successfully",
			data: cartResponse.data,
		});
	} catch (error) {
		throw handleError(error);
	}
};
