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
} from "../variants.type";

export const deleteVariant = async (
	data: DeleteVariantInputType,
): Promise<JsonOk<DeleteVariantOutputType>> => {
	try {
		const { variantId } = data;

		const payload = await db.transaction(async (tx) => {
			const [existingVariant] = await tx
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

			await tx.delete(variant).where(eq(variant.id, variantId));

			let promotedVariantId: string | null = null;

			if (existingVariant.isDefault) {
				const [replacementDefault] = await tx
					.select({ id: variant.id })
					.from(variant)
					.where(eq(variant.productId, existingVariant.productId))
					.orderBy(asc(variant.createdAt))
					.limit(1);

				if (replacementDefault) {
					await tx
						.update(variant)
						.set({ isDefault: true })
						.where(eq(variant.id, replacementDefault.id));
					promotedVariantId = replacementDefault.id;
				}
			}

			return {
				productId: existingVariant.productId,
				promotedVariantId,
			};
		});

		return jsonOk<DeleteVariantOutputType>({
			status: HttpStatusCode.OK,
			message: "Variant deleted successfully",
			data: {
				variantId,
				productId: payload.productId,
				promotedVariantId: payload.promotedVariantId,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
