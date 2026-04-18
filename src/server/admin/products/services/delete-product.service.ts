import { handleError } from "#/errors/error-handler";
import type { DeleteProductInputType } from "../products.admin.type";

export const deleteProduct = async (data: DeleteProductInputType) => {
	try {
		return {
			ok: true,
			message: "Deleted admin product",
			data,
		};
	} catch (error) {
		throw handleError(error);
	}
};
