import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { product, review, user } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	GetReviewByIdInputType,
	GetReviewByIdOutputType,
} from "../reviews.types";

export const getReviewById = async (
	data: GetReviewByIdInputType,
): Promise<JsonOk<GetReviewByIdOutputType>> => {
	try {
		const { reviewId } = data;

		const [row] = await db
			.select({
				id: review.id,
				userId: review.userId,
				productId: review.productId,
				rating: review.rating,
				title: review.title,
				comment: review.comment,
				createdAt: review.createdAt,
				updatedAt: review.updatedAt,
				customerId: user.id,
				customerName: user.name,
				customerImage: user.image,
				productName: product.name,
				productSlug: product.slug,
				productImage: product.image,
			})
			.from(review)
			.innerJoin(user, eq(user.id, review.userId))
			.innerJoin(product, eq(product.id, review.productId))
			.where(eq(review.id, reviewId));

		if (!row) {
			throw notFoundError("Review not found");
		}

		return jsonOk<GetReviewByIdOutputType>({
			status: HttpStatusCode.OK,
			message: "Review fetched successfully",
			data: {
				review: {
					id: row.id,
					userId: row.userId,
					productId: row.productId,
					rating: Number(row.rating),
					title: row.title,
					comment: row.comment,
					createdAt: row.createdAt.toISOString(),
					updatedAt: row.updatedAt.toISOString(),
					customer: {
						id: row.customerId,
						name: row.customerName,
						image: row.customerImage,
					},
					product: {
						id: row.productId,
						name: row.productName,
						slug: row.productSlug,
						image: row.productImage,
					},
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
