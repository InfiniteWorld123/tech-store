import { and, eq, gte, sql } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import {
	address,
	cartItem,
	order,
	orderItem,
	payment,
	shipping,
	variant,
} from "#/db/schema";
import { conflictError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import { validateCart } from "#/server/checkout/cart/services/validate-cart.service";
import {
	ORDER_SHIPPING_FEES,
	ORDER_TAX_RATE,
	roundOrderMoney,
} from "../../shared/order-pricing-rules";
import type {
	PlaceOrderFromCartInputType,
	PlaceOrderFromCartOutputType,
} from "../customer.types";

const createOrderNumber = (): string => {
	const datePart = new Date().toISOString().slice(0, 10).replaceAll("-", "");
	const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();

	return `ORD-${datePart}-${randomPart}`;
};

export const placeOrderFromCart = async (
	data: PlaceOrderFromCartInputType,
): Promise<JsonOk<PlaceOrderFromCartOutputType>> => {
	try {
		const {
			userId,
			addressId,
			shippingMethod,
			notes,
			paymentMethod,
			shippingCarrier,
		} = data;

		const [existingAddress] = await db
			.select({ addressId: address.id })
			.from(address)
			.where(and(eq(address.id, addressId), eq(address.userId, userId)));

		if (!existingAddress) {
			throw notFoundError("Address not found");
		}

		const cartResponse = await validateCart({ userId, sessionId: null });
		const validatedCart = cartResponse.data;

		if (!validatedCart.isValid) {
			throw conflictError("Cart is not ready for checkout", {
				warnings: validatedCart.blockingWarnings,
			});
		}

		const items = validatedCart.cart.items.map((item) => ({
			variantId: item.variantId,
			productId: item.productId,
			productName: item.product.name,
			variantName: item.variant.displayName,
			sku: item.variant.sku,
			quantity: item.quantity,
			unitPrice: item.currentPrice,
			totalPrice: item.lineTotal,
		}));

		const subtotal = roundOrderMoney(validatedCart.cart.summary.subtotal);
		const shippingFee = ORDER_SHIPPING_FEES[shippingMethod];
		const taxAmount = roundOrderMoney(subtotal * ORDER_TAX_RATE);
		const totalAmount = roundOrderMoney(subtotal + shippingFee + taxAmount);

		const payload = await db.transaction(async (tx) => {
			const [createdOrder] = await tx
				.insert(order)
				.values({
					userId,
					addressId,
					orderNumber: createOrderNumber(),
					status: "pending",
					subtotal: subtotal.toString(),
					shippingFee: shippingFee.toString(),
					taxAmount: taxAmount.toString(),
					totalAmount: totalAmount.toString(),
					notes: notes ?? null,
				})
				.returning();

			await tx.insert(orderItem).values(
				items.map((item) => ({
					orderId: createdOrder.id,
					variantId: item.variantId,
					productName: item.productName,
					variantName: item.variantName,
					sku: item.sku,
					quantity: item.quantity,
					unitPrice: item.unitPrice.toString(),
					totalPrice: item.totalPrice.toString(),
				})),
			);

			const [createdPayment] = await tx
				.insert(payment)
				.values({
					orderId: createdOrder.id,
					method: paymentMethod,
					amount: totalAmount.toString(),
					status: "pending",
				})
				.returning();

			const [createdShipping] = await tx
				.insert(shipping)
				.values({
					orderId: createdOrder.id,
					carrier: shippingCarrier,
					method: shippingMethod,
					status: "pending",
					trackingNumber: null,
				})
				.returning();

			for (const item of items) {
				const [updatedVariant] = await tx
					.update(variant)
					.set({
						stockQuantity: sql`${variant.stockQuantity} - ${item.quantity}`,
					})
					.where(
						and(
							eq(variant.id, item.variantId),
							gte(variant.stockQuantity, item.quantity),
						),
					)
					.returning({ id: variant.id });

				if (!updatedVariant) {
					throw conflictError(`${item.productName} does not have enough stock`);
				}
			}

			await tx
				.delete(cartItem)
				.where(eq(cartItem.cartId, validatedCart.cart.id));

			return {
				createdOrder,
				createdPayment,
				createdShipping,
			};
		});

		return jsonOk<PlaceOrderFromCartOutputType>({
			status: HttpStatusCode.CREATED,
			message: "Order placed successfully",
			data: {
				order: {
					id: payload.createdOrder.id,
					orderNumber: payload.createdOrder.orderNumber,
					status: payload.createdOrder.status,
					subtotal: Number(payload.createdOrder.subtotal),
					shippingFee: Number(payload.createdOrder.shippingFee),
					taxAmount: Number(payload.createdOrder.taxAmount),
					totalAmount: Number(payload.createdOrder.totalAmount),
					notes: payload.createdOrder.notes,
					placedAt: payload.createdOrder.placedAt.toISOString(),
				},
				payment: {
					method: payload.createdPayment.method,
					status: payload.createdPayment.status,
					amount: Number(payload.createdPayment.amount),
					paidAt: payload.createdPayment.paidAt?.toISOString() ?? null,
				},
				shipping: {
					method: payload.createdShipping.method,
					carrier: payload.createdShipping.carrier,
					status: payload.createdShipping.status,
					trackingNumber: payload.createdShipping.trackingNumber,
				},
				items,
				itemCount: items.length,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
