import type { shipping } from "#/db/schema";
import type { ShippingType } from "../shipping.types";

type ShippingRowType = typeof shipping.$inferSelect;

export const mapShipping = (row: ShippingRowType): ShippingType => {
	return {
		id: row.id,
		orderId: row.orderId,
		carrier: row.carrier,
		method: row.method,
		trackingNumber: row.trackingNumber,
		status: row.status,
		shippedAt: row.shippedAt?.toISOString() ?? null,
		deliveredAt: row.deliveredAt?.toISOString() ?? null,
		createdAt: row.createdAt.toISOString(),
		updatedAt: row.updatedAt.toISOString(),
	};
};
