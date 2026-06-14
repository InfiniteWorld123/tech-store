import { asc, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { variant } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	DeleteVariantInputType,
	DeleteVariantOutputType,
} from "../variants.types";

export const deleteVariant = async (
	data: DeleteVariantInputType,
): Promise<JsonOk<DeleteVariantOutputType>> => {
	try {
		const { variantId } = data;

		const [existingVariant] = await db
			.select({
				id: variant.id,
				productId: variant.productId,
				isDefault: variant.isDefault,
			})
			.from(variant)
			.where(eq(variant.id, variantId));

		if (!existingVariant) {
			throw notFoundError("Variant not found");
		}

		await db.delete(variant).where(eq(variant.id, variantId));

		let promotedVariantId: string | null = null;

		if (existingVariant.isDefault) {
			const [replacementDefault] = await db
				.select({ id: variant.id })
				.from(variant)
				.where(eq(variant.productId, existingVariant.productId))
				.orderBy(asc(variant.createdAt))
				.limit(1);

			if (replacementDefault) {
				await db
					.update(variant)
					.set({ isDefault: true })
					.where(eq(variant.id, replacementDefault.id));
				promotedVariantId = replacementDefault.id;
			}
		}

		return jsonOk<DeleteVariantOutputType>({
			status: HttpStatusCode.OK,
			message: "Variant deleted successfully",
			data: {
				variantId,
				productId: existingVariant.productId,
				promotedVariantId,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
