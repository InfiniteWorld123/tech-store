import { and, eq, gte, sql } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { cartItem, orderItem, variant } from "#/db/schema";
import { conflictError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import { validateCart } from "#/server/cart/services/validate-cart.service";
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

type CreatedCheckoutRows = {
	orderId: string;
	orderNumber: string;
	orderStatus: "pending" | "processing" | "completed" | "cancelled";
	orderSubtotal: string;
	orderShippingFee: string;
	orderTaxAmount: string;
	orderTotalAmount: string;
	orderNotes: string | null;
	orderPlacedAt: string;
	paymentMethod: "card" | "paypal" | "bank_transfer" | "cash_on_delivery";
	paymentStatus: "pending" | "paid" | "failed" | "refunded";
	paymentAmount: string;
	paymentPaidAt: string | null;
	shippingMethod: "standard" | "express" | "same_day";
	shippingCarrier: "dhl" | "hermes" | "ups" | "fedex";
	shippingStatus: "pending" | "packed" | "shipped" | "in_transit" | "delivered";
	shippingTrackingNumber: string | null;
};

const serializeTimestamp = (value: string | Date | null): string | null => {
	if (!value) return null;
	if (value instanceof Date) return value.toISOString();

	return new Date(value.replace(" ", "T")).toISOString();
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

		const createCheckoutRows = await db.execute<CreatedCheckoutRows>(sql`
			with created_order as (
				insert into "order" (
					"user_id",
					"address_id",
					"order_number",
					"status",
					"subtotal",
					"shipping_fee",
					"tax_amount",
					"total_amount",
					"notes"
				)
				select
					${userId},
					a.id,
					${createOrderNumber()},
					${"pending"}::order_status,
					${subtotal.toString()}::numeric,
					${shippingFee.toString()}::numeric,
					${taxAmount.toString()}::numeric,
					${totalAmount.toString()}::numeric,
					${notes ?? null}
				from address a
				where a.id = ${addressId}
					and a.user_id = ${userId}
				returning
					id,
					order_number,
					status,
					subtotal,
					shipping_fee,
					tax_amount,
					total_amount,
					notes,
					placed_at
			),
			created_payment as (
				insert into payment (
					"order_id",
					"method",
					"amount",
					"status"
				)
				select
					id,
					${paymentMethod}::payment_method,
					${totalAmount.toString()}::numeric,
					${"pending"}::payment_status
				from created_order
				returning method, status, amount, paid_at
			),
			created_shipping as (
				insert into shipping (
					"order_id",
					"carrier",
					"method",
					"status",
					"tracking_number"
				)
				select
					id,
					${shippingCarrier}::shipping_carrier,
					${shippingMethod}::shipping_method,
					${"pending"}::shipping_status,
					null
				from created_order
				returning method, carrier, status, tracking_number
			)
			select
				created_order.id as "orderId",
				created_order.order_number as "orderNumber",
				created_order.status as "orderStatus",
				created_order.subtotal as "orderSubtotal",
				created_order.shipping_fee as "orderShippingFee",
				created_order.tax_amount as "orderTaxAmount",
				created_order.total_amount as "orderTotalAmount",
				created_order.notes as "orderNotes",
				created_order.placed_at as "orderPlacedAt",
				created_payment.method as "paymentMethod",
				created_payment.status as "paymentStatus",
				created_payment.amount as "paymentAmount",
				created_payment.paid_at as "paymentPaidAt",
				created_shipping.method as "shippingMethod",
				created_shipping.carrier as "shippingCarrier",
				created_shipping.status as "shippingStatus",
				created_shipping.tracking_number as "shippingTrackingNumber"
			from created_order
			cross join created_payment
			cross join created_shipping
		`);

		const createdCheckout = createCheckoutRows.rows[0];

		if (!createdCheckout) {
			throw notFoundError("Address not found");
		}

		await db.insert(orderItem).values(
			items.map((item) => ({
				orderId: createdCheckout.orderId,
				variantId: item.variantId,
				productName: item.productName,
				variantName: item.variantName,
				sku: item.sku,
				quantity: item.quantity,
				unitPrice: item.unitPrice.toString(),
				totalPrice: item.totalPrice.toString(),
			})),
		);

		for (const item of items) {
			const [updatedVariant] = await db
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

		await db.delete(cartItem).where(eq(cartItem.cartId, validatedCart.cart.id));

		return jsonOk<PlaceOrderFromCartOutputType>({
			status: HttpStatusCode.CREATED,
			message: "Order placed successfully",
			data: {
				order: {
					id: createdCheckout.orderId,
					orderNumber: createdCheckout.orderNumber,
					status: createdCheckout.orderStatus,
					subtotal: Number(createdCheckout.orderSubtotal),
					shippingFee: Number(createdCheckout.orderShippingFee),
					taxAmount: Number(createdCheckout.orderTaxAmount),
					totalAmount: Number(createdCheckout.orderTotalAmount),
					notes: createdCheckout.orderNotes,
					placedAt:
						serializeTimestamp(createdCheckout.orderPlacedAt) ??
						new Date().toISOString(),
				},
				payment: {
					method: createdCheckout.paymentMethod,
					status: createdCheckout.paymentStatus,
					amount: Number(createdCheckout.paymentAmount),
					paidAt: serializeTimestamp(createdCheckout.paymentPaidAt),
				},
				shipping: {
					method: createdCheckout.shippingMethod,
					carrier: createdCheckout.shippingCarrier,
					status: createdCheckout.shippingStatus,
					trackingNumber: createdCheckout.shippingTrackingNumber,
				},
				items,
				itemCount: items.length,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
