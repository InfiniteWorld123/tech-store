import { handleError } from "#/errors/error-handler";
import type { UpdateProductInputType } from "../products.admin.type";

export const updateProduct = async (data: UpdateProductInputType) => {
	try {
		return {
			ok: true,
			message: "Updated admin product",
			data,
		};
	} catch (error) {
		throw handleError(error);
	}
};
