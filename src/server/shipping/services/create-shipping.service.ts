import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order, shipping } from "#/db/schema";
import { conflictError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	CreateShippingInputType,
	CreateShippingOutputType,
} from "../shipping.types";
import { mapShipping } from "./shipping-mappers";

export const createShipping = async (
	data: CreateShippingInputType,
): Promise<JsonOk<CreateShippingOutputType>> => {
	try {
		const { carrier, method, orderId } = data;

		const createdShipping = await db.transaction(async (tx) => {
			const [existingOrder] = await tx
				.select({ id: order.id })
				.from(order)
				.where(eq(order.id, orderId));

			if (!existingOrder) {
				throw notFoundError("Order not found");
			}

			const [existingShipping] = await tx
				.select({ id: shipping.id })
				.from(shipping)
				.where(eq(shipping.orderId, orderId));

			if (existingShipping) {
				throw conflictError("Order already has shipping");
			}

			const [row] = await tx
				.insert(shipping)
				.values({
					orderId,
					carrier,
					method,
					status: "pending",
					trackingNumber: null,
				})
				.returning();

			return row;
		});

		return jsonOk<CreateShippingOutputType>({
			status: HttpStatusCode.CREATED,
			message: "Shipping created successfully",
			data: {
				shipping: mapShipping(createdShipping),
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
