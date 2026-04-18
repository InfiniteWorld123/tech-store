import { handleError } from "#/errors/error-handler";
import type { DeleteProductsInputType } from "../products.admin.type";

export const deleteProducts = async (data: DeleteProductsInputType) => {
	try {
		return {
			ok: true,
			message: "Deleted admin products",
			data,
		};
	} catch (error) {
		throw handleError(error);
	}
};
