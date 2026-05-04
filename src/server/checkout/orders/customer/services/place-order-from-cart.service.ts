import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { handleError } from "#/errors/error-handler";

export const placeOrderFromCart = async (): Promise<JsonOk<null>> => {
	try {
		return jsonOk({
			data: null,
			message: "Place order from cart is not implemented yet",
            status: HttpStatusCode.OK
		});
	} catch (error) {
		throw handleError(error);
	}
};