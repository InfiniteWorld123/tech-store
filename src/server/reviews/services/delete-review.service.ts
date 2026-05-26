import { and, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { review } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	DeleteReviewInputType,
	DeleteReviewOutputType,
} from "../reviews.types";

export const deleteReview = async (
	data: DeleteReviewInputType,
): Promise<JsonOk<DeleteReviewOutputType>> => {
	try {
		const { reviewId, userId } = data;

		const [existingReview] = await db
			.select({ id: review.id })
			.from(review)
			.where(and(eq(review.id, reviewId), eq(review.userId, userId)));

		if (!existingReview) {
			throw notFoundError("Review not found");
		}

		await db.delete(review).where(eq(review.id, reviewId));

		return jsonOk<DeleteReviewOutputType>({
			status: HttpStatusCode.OK,
			message: "Review deleted successfully",
			data: {
				reviewId,
				deleted: true,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
