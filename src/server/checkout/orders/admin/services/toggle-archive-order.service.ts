import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	ToggleOrderArchiveInputType,
	ToggleOrderArchiveOutputType,
} from "../admin.types";

export const toggleOrderArchive = async (
	data: ToggleOrderArchiveInputType,
): Promise<JsonOk<ToggleOrderArchiveOutputType>> => {
	try {
		const [existingOrder] = await db
			.select({
				id: order.id,
				archivedAt: order.archivedAt,
			})
			.from(order)
			.where(eq(order.id, data.orderId));

		if (!existingOrder) {
			throw notFoundError("Order not found");
		}

		const nextArchivedAt = existingOrder.archivedAt ? null : new Date();

		const [updatedOrder] = await db
			.update(order)
			.set({ archivedAt: nextArchivedAt })
			.where(eq(order.id, data.orderId))
			.returning({
				id: order.id,
				archivedAt: order.archivedAt,
			});

		return jsonOk({
			status: HttpStatusCode.OK,
			message: nextArchivedAt
				? "Order archived successfully"
				: "Order restored successfully",
			data: {
				orderId: updatedOrder.id,
				archived: updatedOrder.archivedAt !== null,
				archivedAt: updatedOrder.archivedAt?.toISOString() ?? null,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
