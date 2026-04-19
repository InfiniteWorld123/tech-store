import { inArray } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { product } from "#/db/schema";
import { badRequestError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	DeleteProductsInputType,
	DeleteProductsOutputType,
} from "../products.type";

export const deleteProducts = async (
	data: DeleteProductsInputType,
): Promise<JsonOk<DeleteProductsOutputType>> => {
	try {
		const { productIds } = data;

		// `variant.productId` uses `onDelete: "cascade"`, so deleting products
		// removes all related variants (and variant images) automatically.
		const deletedProducts = await db
			.delete(product)
			.where(inArray(product.id, productIds))
			.returning({ id: product.id });

		if (deletedProducts.length === 0) {
			throw badRequestError("No products were found to delete");
		}

		if (deletedProducts.length !== productIds.length) {
			throw badRequestError("Some products were not found");
		}
		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Products and related variants deleted successfully",
			data: {
				productIds: deletedProducts.map((item) => item.id),
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
