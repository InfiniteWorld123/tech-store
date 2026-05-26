import { avg, count, max, min, sql } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { product, review } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	GetReviewMetricsInputType,
	GetReviewMetricsOutputType,
} from "../analytics.types";

export const getReviewMetrics = async (
	_data: GetReviewMetricsInputType,
): Promise<JsonOk<GetReviewMetricsOutputType>> => {
	try {
		const [reviewStats] = await db
			.select({
				totalReviews: count(),
				averageRating: avg(review.rating),
				productsWithReviews: sql<number>`count(distinct ${review.productId})`,

				starOne: sql<number>`count(*) filter (where ${review.rating} = 1)`,
				starTwo: sql<number>`count(*) filter (where ${review.rating} = 2)`,
				starThree: sql<number>`count(*) filter (where ${review.rating} = 3)`,
				starFour: sql<number>`count(*) filter (where ${review.rating} = 4)`,
				starFive: sql<number>`count(*) filter (where ${review.rating} = 5)`,
			})
			.from(review);

		const [productRatingStats] = await db
			.select({
				highestRatedProduct: max(product.ratingAvg),
				lowestRatedProduct: min(product.ratingAvg),
			})
			.from(product);

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Review metrics fetched successfully",
			data: {
				totalReviews: reviewStats.totalReviews,
				averageRating: Number(reviewStats.averageRating ?? 0),
				highestRatedProduct: Number(
					productRatingStats.highestRatedProduct ?? 0,
				),
				lowestRatedProduct: Number(productRatingStats.lowestRatedProduct ?? 0),
				productsWithReviews: reviewStats.productsWithReviews,
				byStar: {
					one: reviewStats.starOne,
					two: reviewStats.starTwo,
					three: reviewStats.starThree,
					four: reviewStats.starFour,
					five: reviewStats.starFive,
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
