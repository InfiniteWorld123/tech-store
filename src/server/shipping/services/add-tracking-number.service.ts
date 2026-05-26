import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { shipping } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	AddTrackingNumberInputType,
	AddTrackingNumberOutputType,
} from "../shipping.types";
import { mapShipping } from "./shipping-mappers";

export const addTrackingNumber = async (
	data: AddTrackingNumberInputType,
): Promise<JsonOk<AddTrackingNumberOutputType>> => {
	try {
		const { carrier, orderId, trackingNumber } = data;

		const [updatedShipping] = await db
			.update(shipping)
			.set({
				trackingNumber,
				...(carrier !== undefined ? { carrier } : {}),
			})
			.where(eq(shipping.orderId, orderId))
			.returning();

		if (!updatedShipping) {
			throw notFoundError("Shipping not found");
		}

		return jsonOk<AddTrackingNumberOutputType>({
			status: HttpStatusCode.OK,
			message: "Tracking number added successfully",
			data: {
				shipping: mapShipping(updatedShipping),
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
