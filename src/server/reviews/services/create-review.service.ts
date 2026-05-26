import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { product, review } from "#/db/schema";
import { conflictError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	CreateReviewInputType,
	CreateReviewOutputType,
} from "../reviews.types";

export const createReview = async (
	data: CreateReviewInputType,
): Promise<JsonOk<CreateReviewOutputType>> => {
	try {
		const { comment, productId, rating, title, userId } = data;

		const [existingProduct] = await db
			.select({ id: product.id })
			.from(product)
			.where(and(eq(product.id, productId), eq(product.isActive, true)));

		if (!existingProduct) {
			throw notFoundError("Product not found");
		}

		const [existingReview] = await db
			.select({ id: review.id })
			.from(review)
			.where(and(eq(review.productId, productId), eq(review.userId, userId)));

		if (existingReview) {
			throw conflictError("You have already reviewed this product");
		}

		const [createdReview] = await db
			.insert(review)
			.values({
				userId,
				productId,
				rating: rating.toString(),
				title,
				comment,
			})
			.returning();

		return jsonOk<CreateReviewOutputType>({
			status: HttpStatusCode.CREATED,
			message: "Review created successfully",
			data: {
				review: {
					id: createdReview.id,
					userId: createdReview.userId,
					productId: createdReview.productId,
					rating: Number(createdReview.rating),
					title: createdReview.title,
					comment: createdReview.comment,
					createdAt: createdReview.createdAt.toISOString(),
					updatedAt: createdReview.updatedAt.toISOString(),
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
