import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { cart, cartItem, product, variant } from "#/db/schema";
import {
	badRequestError,
	conflictError,
	notFoundError,
	unauthorizedError,
} from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type { AddToCartInputType, AddToCartOutputType } from "../cart.types";
import { getCart } from "./get-cart.service";

export const addToCart = async (
	data: AddToCartInputType,
): Promise<JsonOk<AddToCartOutputType>> => {
	try {
		const { userId, sessionId, variantId, quantity } = data;

		if (!userId && !sessionId) {
			throw unauthorizedError("Cart owner is required");
		}

		const [existingVariant] = await db
			.select({
				price: variant.price,
				stock: variant.stockQuantity,
				productId: product.id,
				isActive: product.isActive,
			})
			.from(variant)
			.innerJoin(product, eq(product.id, variant.productId))
			.where(eq(variant.id, variantId));

		if (!existingVariant) {
			throw notFoundError("Variant not found");
		}

		if (!existingVariant.isActive) {
			throw badRequestError("Inactive product");
		}

		if (existingVariant.stock <= 0) {
			throw conflictError("Out of stock");
		}

		if (quantity > existingVariant.stock) {
			throw conflictError("Requested quantity too high");
		}

		const cartOwnerCondition = userId
			? eq(cart.userId, userId)
			: eq(cart.sessionId, sessionId as string);

		const [existingCart] = await db
			.select()
			.from(cart)
			.where(cartOwnerCondition);

		let activeCart = existingCart;

		if (!activeCart) {
			const [createdCart] = await db
				.insert(cart)
				.values({
					userId,
					sessionId,
				})
				.returning();

			activeCart = createdCart;
		}

		const [existingCartItem] = await db
			.select()
			.from(cartItem)
			.where(
				and(
					eq(cartItem.cartId, activeCart.id),
					eq(cartItem.variantId, variantId),
				),
			);

		if (existingCartItem) {
			const newQuantity = existingCartItem.quantity + quantity;

			if (newQuantity > existingVariant.stock) {
				throw conflictError("Requested quantity exceeds available stock");
			}

			await db
				.update(cartItem)
				.set({
					quantity: newQuantity,
					priceAtTime: existingVariant.price,
				})
				.where(eq(cartItem.id, existingCartItem.id));
		} else {
			await db.insert(cartItem).values({
				cartId: activeCart.id,
				variantId,
				quantity,
				priceAtTime: existingVariant.price,
			});
		}

		const cartResponse = await getCart({ userId, sessionId });

		return jsonOk<AddToCartOutputType>({
			status: HttpStatusCode.CREATED,
			message: "Item added to cart successfully",
			data: cartResponse.data,
		});
	} catch (error) {
		throw handleError(error);
	}
};
