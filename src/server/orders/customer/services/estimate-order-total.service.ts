import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { address } from "#/db/schema";
import { conflictError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import { validateCart } from "#/server/cart/services/validate-cart.service";
import {
	ORDER_SHIPPING_FEES,
	ORDER_TAX_RATE,
	roundOrderMoney,
} from "../../shared/order-pricing-rules";
import type {
	EstimateOrderTotalInputType,
	EstimateOrderTotalOutputType,
} from "../customer.types";

export const estimateOrderTotal = async (
	data: EstimateOrderTotalInputType,
): Promise<JsonOk<EstimateOrderTotalOutputType>> => {
	try {
		const { userId, shippingMethod, addressId } = data;

		const [existingAddress] = await db
			.select({
				id: address.id,
			})
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

		return jsonOk<EstimateOrderTotalOutputType>({
			status: HttpStatusCode.OK,
			message: "Order total estimated successfully",
			data: {
				items,
				summary: {
					itemsCount: validatedCart.cart.summary.itemsCount,
					uniqueItemsCount: validatedCart.cart.summary.uniqueItemsCount,
					subtotal,
					shippingFee,
					taxAmount,
					totalAmount,
					taxRate: ORDER_TAX_RATE,
					shippingMethod,
					canCheckout: validatedCart.isValid,
				},
				warnings: validatedCart.cart.warnings,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
