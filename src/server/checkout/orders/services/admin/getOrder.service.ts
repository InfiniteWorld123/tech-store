import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import {
	address,
	order,
	orderItem,
	payment,
	shipping,
	user,
} from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	AdminOrderDetailType,
	GetOrderDetailInputType,
	GetOrderDetailOutputType,
} from "../../types/order.admin.type";

export const getOrder = async (
	data: GetOrderDetailInputType,
): Promise<JsonOk<GetOrderDetailOutputType>> => {
	try {
		const [row] = await db
			.select({
				id: order.id,
				userId: order.userId,
				addressId: order.addressId,
				orderNumber: order.orderNumber,
				status: order.status,
				subtotal: order.subtotal,
				shippingFee: order.shippingFee,
				taxAmount: order.taxAmount,
				totalAmount: order.totalAmount,
				notes: order.notes,
				placedAt: order.placedAt,
				createdAt: order.createdAt,
				updatedAt: order.updatedAt,
				customerName: user.name,
				customerEmail: user.email,
				addressFullName: address.fullName,
				addressPhone: address.phone,
				addressStreet: address.street,
				addressPostalCode: address.postalCode,
				addressCity: address.city,
				addressState: address.state,
				addressCountry: address.country,
				paymentId: payment.id,
				paymentMethod: payment.method,
				paymentStatus: payment.status,
				paymentAmount: payment.amount,
				paymentPaidAt: payment.paidAt,
				paymentCreatedAt: payment.createdAt,
				paymentUpdatedAt: payment.updatedAt,
				shippingId: shipping.id,
				shippingCarrier: shipping.carrier,
				shippingMethod: shipping.method,
				shippingStatus: shipping.status,
				shippingTrackingNumber: shipping.trackingNumber,
				shippingShippedAt: shipping.shippedAt,
				shippingDeliveredAt: shipping.deliveredAt,
				shippingCreatedAt: shipping.createdAt,
				shippingUpdatedAt: shipping.updatedAt,
			})
			.from(order)
			.innerJoin(user, eq(user.id, order.userId))
			.innerJoin(address, eq(address.id, order.addressId))
			.innerJoin(payment, eq(payment.orderId, order.id))
			.innerJoin(shipping, eq(shipping.orderId, order.id))
			.where(eq(order.id, data.orderId));

		if (!row) {
			throw notFoundError("Order not found");
		}

		const itemRows = await db
			.select({
				id: orderItem.id,
				variantId: orderItem.variantId,
				productName: orderItem.productName,
				variantName: orderItem.variantName,
				sku: orderItem.sku,
				quantity: orderItem.quantity,
				unitPrice: orderItem.unitPrice,
				totalPrice: orderItem.totalPrice,
			})
			.from(orderItem)
			.where(eq(orderItem.orderId, data.orderId));

		const items = itemRows.map((item) => ({
			...item,
			unitPrice: Number(item.unitPrice),
			totalPrice: Number(item.totalPrice),
		}));

		const orderDetail: AdminOrderDetailType = {
			id: row.id,
			userId: row.userId,
			addressId: row.addressId,
			orderNumber: row.orderNumber,
			status: row.status,
			subtotal: Number(row.subtotal),
			shippingFee: Number(row.shippingFee),
			taxAmount: Number(row.taxAmount),
			totalAmount: Number(row.totalAmount),
			notes: row.notes,
			placedAt: row.placedAt.toISOString(),
			createdAt: row.createdAt.toISOString(),
			updatedAt: row.updatedAt.toISOString(),
			customer: {
				id: row.userId,
				name: row.customerName,
				email: row.customerEmail,
			},
			address: {
				id: row.addressId,
				fullName: row.addressFullName,
				phone: row.addressPhone,
				street: row.addressStreet,
				postalCode: row.addressPostalCode,
				city: row.addressCity,
				state: row.addressState,
				country: row.addressCountry,
			},
			payment: {
				id: row.paymentId,
				method: row.paymentMethod,
				status: row.paymentStatus,
				amount: Number(row.paymentAmount),
				paidAt: row.paymentPaidAt?.toISOString() ?? null,
				createdAt: row.paymentCreatedAt.toISOString(),
				updatedAt: row.paymentUpdatedAt.toISOString(),
			},
			shipping: {
				id: row.shippingId,
				carrier: row.shippingCarrier,
				method: row.shippingMethod,
				status: row.shippingStatus,
				trackingNumber: row.shippingTrackingNumber,
				shippedAt: row.shippingShippedAt?.toISOString() ?? null,
				deliveredAt: row.shippingDeliveredAt?.toISOString() ?? null,
				createdAt: row.shippingCreatedAt.toISOString(),
				updatedAt: row.shippingUpdatedAt.toISOString(),
			},
			items,
			itemCount: items.length,
		};

		return jsonOk<GetOrderDetailOutputType>({
			status: HttpStatusCode.OK,
			message: "Order fetched successfully",
			data: {
				item: orderDetail,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
