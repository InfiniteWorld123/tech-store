import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { review } from "#/db/schema";
import { badRequestError, notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	UpdateReviewInputType,
	UpdateReviewOutputType,
} from "../reviews.types";

export const updateReview = async (
	data: UpdateReviewInputType,
): Promise<JsonOk<UpdateReviewOutputType>> => {
	try {
		const { comment, rating, reviewId, title, userId } = data;

		if (rating === undefined && title === undefined && comment === undefined) {
			throw badRequestError("At least one review field must be updated");
		}

		const [existingReview] = await db
			.select({ id: review.id })
			.from(review)
			.where(and(eq(review.id, reviewId), eq(review.userId, userId)));

		if (!existingReview) {
			throw notFoundError("Review not found");
		}

		const [updatedReview] = await db
			.update(review)
			.set({
				...(rating !== undefined ? { rating: rating.toString() } : {}),
				...(title !== undefined ? { title } : {}),
				...(comment !== undefined ? { comment } : {}),
			})
			.where(eq(review.id, reviewId))
			.returning();

		return jsonOk<UpdateReviewOutputType>({
			status: HttpStatusCode.OK,
			message: "Review updated successfully",
			data: {
				review: {
					id: updatedReview.id,
					userId: updatedReview.userId,
					productId: updatedReview.productId,
					rating: Number(updatedReview.rating),
					title: updatedReview.title,
					comment: updatedReview.comment,
					createdAt: updatedReview.createdAt.toISOString(),
					updatedAt: updatedReview.updatedAt.toISOString(),
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
