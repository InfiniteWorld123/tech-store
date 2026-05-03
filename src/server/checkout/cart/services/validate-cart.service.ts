import { type JsonOk, jsonOk } from "#/constants/json";
import { unauthorizedError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	ValidateCartInputType,
	ValidateCartOutputType,
} from "../cart.types";
import { getCart } from "./get-cart.service";

export const validateCart = async (
	data: ValidateCartInputType,
): Promise<JsonOk<ValidateCartOutputType>> => {
	try {
		const { userId, sessionId } = data;

		if (!userId && !sessionId) {
			throw unauthorizedError("Cart owner is required");
		}

		const cartResponse = await getCart({ userId, sessionId });

		const blockingWarnings = cartResponse.data.warnings.filter((warning) =>
			["out_of_stock", "product_unavailable", "price_changed"].includes(
				warning.type,
			),
		);

		const isValid =
			cartResponse.data.items.length > 0 &&
			cartResponse.data.summary.canCheckout &&
			blockingWarnings.length === 0;

		return jsonOk<ValidateCartOutputType>({
			status: cartResponse.status,
			message: isValid ? "Cart is valid" : "Cart needs attention",
			data: {
				isValid,
				cart: cartResponse.data,
				blockingWarnings,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
