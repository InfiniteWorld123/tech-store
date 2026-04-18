import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { product } from "#/db/schema";
import { badRequestError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	DeleteProductInputType,
	DeleteProductOutputType,
} from "../products.type";

export const deleteProduct = async (
	data: DeleteProductInputType,
): Promise<JsonOk<DeleteProductOutputType>> => {
	try {
		const { productId } = data;

		// `variant.productId` uses `onDelete: "cascade"`, so deleting the product
		// removes all of its variants (and variant images) automatically.
		const [deletedProduct] = await db
			.delete(product)
			.where(eq(product.id, productId))
			.returning({ id: product.id });

		if (!deletedProduct) {
			throw badRequestError("Product not found");
		}

		return jsonOk<DeleteProductOutputType>({
			status: HttpStatusCode.OK,
			message: "Product and related variants deleted successfully",
			data: {
				productId,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
