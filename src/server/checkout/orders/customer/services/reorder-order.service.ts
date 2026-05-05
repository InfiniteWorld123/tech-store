import { HttpStatusCode } from "#/constants/http";
import { jsonOk, type JsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { cart, cartItem, order, orderItem, product, variant } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import { and, eq } from "drizzle-orm";
import type { reorderOrderInputType, ReorderOrderOutputType } from "../customer.types";
import { notFoundError } from "#/errors/app-error";
import type { CartWarningType } from "#/server/checkout/cart/cart.types";

export const reorderOrder = async (
    data: reorderOrderInputType
): Promise<JsonOk<ReorderOrderOutputType>> => {
    try {
        const { userId, orderId } = data

        const items = await db
            .select({
                variantId: orderItem.variantId,
                quantity: orderItem.quantity,
            })
            .from(orderItem)
            .innerJoin(order, eq(order.id, orderItem.orderId))
            .where(and(
                eq(orderItem.orderId, orderId),
                eq(order.userId, userId)
            ))

        if (items.length === 0) throw notFoundError("Order not found")

        const [existingCart] = await db
            .select({ id: cart.id })
            .from(cart)
            .where(eq(cart.userId, userId))

        let activeCart = existingCart

        if (!activeCart) {
            const [createdCart] = await db
                .insert(cart)
                .values({ userId })
                .returning({ id: cart.id })

            activeCart = createdCart
        }

        let addedCount = 0;
        let skippedCount = 0;
        const warnings: CartWarningType[] = [];

        for (const item of items) {
            const [existingVariant] = await db
                .select({
                    stock: variant.stockQuantity,
                    isActive: product.isActive,
                    price: variant.price,
                })
                .from(variant)
                .innerJoin(product, eq(product.id, variant.productId))
                .where(eq(variant.id, item.variantId))

            if (!existingVariant || !existingVariant.isActive) {
                warnings.push({
                    type: "product_unavailable",
                    cartItemId: null,
                    variantId: item.variantId,
                    productId: null,
                    message: "This item is no longer available and was skipped",
                })
                skippedCount++
                continue
            }

            if (existingVariant.stock <= 0) {
                warnings.push({
                    type: "out_of_stock",
                    cartItemId: null,
                    variantId: item.variantId,
                    productId: null,
                    message: "This item is out of stock and was skipped",
                })
                skippedCount++
                continue
            }

            const [existingCartItem] = await db
                .select({ id: cartItem.id, quantity: cartItem.quantity })
                .from(cartItem)
                .where(and(
                    eq(cartItem.cartId, activeCart.id),
                    eq(cartItem.variantId, item.variantId)
                ))

            if (existingCartItem) {
                await db
                    .update(cartItem)
                    .set({ quantity: existingCartItem.quantity + item.quantity })
                    .where(eq(cartItem.id, existingCartItem.id))
            } else {
                await db
                    .insert(cartItem)
                    .values({
                        cartId: activeCart.id,
                        quantity: item.quantity,
                        variantId: item.variantId,
                        priceAtTime: existingVariant.price
                    })
            }
            addedCount++;
        }

        return jsonOk({
            status: HttpStatusCode.OK,
            message: "order is reordered successfully",
            data: {
                addedCount,
                skippedCount,
                warnings,
            }
        })
    } catch (error) {
        throw handleError(error)
    }
}