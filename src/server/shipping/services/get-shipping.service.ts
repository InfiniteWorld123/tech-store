import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { shipping } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	GetShippingInputType,
	GetShippingOutputType,
} from "../shipping.types";
import { mapShipping } from "./shipping-mappers";

export const getShipping = async (
	data: GetShippingInputType,
): Promise<JsonOk<GetShippingOutputType>> => {
	try {
		const [row] = await db
			.select()
			.from(shipping)
			.where(eq(shipping.orderId, data.orderId));

		if (!row) {
			throw notFoundError("Shipping not found");
		}

		return jsonOk<GetShippingOutputType>({
			status: HttpStatusCode.OK,
			message: "Shipping fetched successfully",
			data: {
				shipping: mapShipping(row),
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
