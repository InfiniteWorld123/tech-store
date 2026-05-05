import { and, eq, sql } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import {
	address,
	order,
	orderItem,
	payment,
	shipping,
	variant,
	variantImage,
} from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	GetCustomerOrderDetailInputType,
	GetCustomerOrderDetailOutputType,
} from "../customer.types";

export const getCustomerOrderDetail = async (
	data: GetCustomerOrderDetailInputType,
): Promise<JsonOk<GetCustomerOrderDetailOutputType>> => {
	try {
		const { orderId, userId } = data;

		const [existingOrder] = await db
			.select({
				id: order.id,
				orderNumber: order.orderNumber,
				orderStatus: order.status,
				subtotal: order.subtotal,
				shippingFee: order.shippingFee,
				taxAmount: order.taxAmount,
				totalAmount: order.totalAmount,
				notes: order.notes,
				placedAt: order.placedAt,

				paymentMethod: payment.method,
				amount: payment.amount,
				paymentStatus: payment.status,
				paidAt: payment.paidAt,

				carrier: shipping.carrier,
				shippingMethod: shipping.method,
				trackingNumber: shipping.trackingNumber,
				shippingStatus: shipping.status,
				shippedAt: shipping.shippedAt,
				deliveredAt: shipping.deliveredAt,

				fullName: address.fullName,
				phone: address.phone,
				street: address.street,
				postalCode: address.postalCode,
				city: address.city,
				state: address.state,
				country: address.country,
			})
			.from(order)
			.innerJoin(payment, eq(payment.orderId, order.id))
			.innerJoin(shipping, eq(shipping.orderId, order.id))
			.innerJoin(address, eq(address.id, order.addressId))
			.where(and(eq(order.id, orderId), eq(order.userId, userId)));

		if (!existingOrder) {
			throw notFoundError("Order not found");
		}

		const orderItems = await db
			.select({
				variantId: orderItem.variantId,
				productId: variant.productId,
				productName: orderItem.productName,
				variantName: orderItem.variantName,
				sku: orderItem.sku,
				quantity: orderItem.quantity,
				unitPrice: orderItem.unitPrice,
				totalPrice: orderItem.totalPrice,
				image: sql<string | null>`(
                    select ${variantImage.image}
                    from ${variantImage}
                    where ${variantImage.variantId} = ${orderItem.variantId}
                    order by ${variantImage.sortOrder}
                    limit 1
                )`,
			})
			.from(orderItem)
			.innerJoin(variant, eq(variant.id, orderItem.variantId))
			.where(eq(orderItem.orderId, orderId));

		const canCancel = ["pending", "processing"].includes(
			existingOrder.orderStatus,
		);
		const canTrack = existingOrder.trackingNumber !== null;

		return jsonOk<GetCustomerOrderDetailOutputType>({
			status: HttpStatusCode.OK,
			message: "Order fetched successfully",
			data: {
				id: existingOrder.id,
				orderNumber: existingOrder.orderNumber,
				status: existingOrder.orderStatus,
				subtotal: Number(existingOrder.subtotal),
				shippingFee: Number(existingOrder.shippingFee),
				taxAmount: Number(existingOrder.taxAmount),
				totalAmount: Number(existingOrder.totalAmount),
				notes: existingOrder.notes,
				placedAt: existingOrder.placedAt.toISOString(),
				itemCount: orderItems.length,
				items: orderItems.map((item) => ({
					variantId: item.variantId,
					productId: item.productId,
					productName: item.productName,
					variantName: item.variantName,
					sku: item.sku,
					quantity: item.quantity,
					unitPrice: Number(item.unitPrice),
					totalPrice: Number(item.totalPrice),
					image: item.image,
				})),
				payment: {
					method: existingOrder.paymentMethod,
					amount: Number(existingOrder.amount),
					status: existingOrder.paymentStatus,
					paidAt: existingOrder.paidAt?.toISOString() ?? null,
				},
				shipping: {
					carrier: existingOrder.carrier,
					method: existingOrder.shippingMethod,
					trackingNumber: existingOrder.trackingNumber,
					status: existingOrder.shippingStatus,
					shippedAt: existingOrder.shippedAt?.toISOString() ?? null,
					deliveredAt: existingOrder.deliveredAt?.toISOString() ?? null,
				},
				address: {
					fullName: existingOrder.fullName,
					phone: existingOrder.phone,
					street: existingOrder.street,
					postalCode: existingOrder.postalCode,
					city: existingOrder.city,
					state: existingOrder.state,
					country: existingOrder.country,
				},
				canCancel,
				canTrack,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
