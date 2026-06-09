import { and, avg, count, eq, sql } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { product, review } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	GetProductRatingSummaryInputType,
	GetProductRatingSummaryOutputType,
} from "../reviews.types";

export const getProductRatingSummary = async (
	data: GetProductRatingSummaryInputType,
): Promise<JsonOk<GetProductRatingSummaryOutputType>> => {
	try {
		const { productId } = data;

		const [existingProduct] = await db
			.select({ id: product.id })
			.from(product)
			.where(and(eq(product.id, productId), eq(product.isActive, true)));

		if (!existingProduct) {
			throw notFoundError("Product not found");
		}

		const [summary] = await db
			.select({
				averageRating: avg(review.rating),
				reviewsCount: count(review.id),
				one: sql<number>`count(*) filter (where ${review.rating} >= 1 and ${review.rating} < 2)`,
				two: sql<number>`count(*) filter (where ${review.rating} >= 2 and ${review.rating} < 3)`,
				three: sql<number>`count(*) filter (where ${review.rating} >= 3 and ${review.rating} < 4)`,
				four: sql<number>`count(*) filter (where ${review.rating} >= 4 and ${review.rating} < 5)`,
				five: sql<number>`count(*) filter (where ${review.rating} = 5)`,
			})
			.from(review)
			.where(eq(review.productId, productId));

		return jsonOk<GetProductRatingSummaryOutputType>({
			status: HttpStatusCode.OK,
			message: "Product rating summary fetched successfully",
			data: {
				summary: {
					productId,
					averageRating: Number(summary.averageRating ?? 0),
					reviewsCount: summary.reviewsCount,
					ratingCounts: {
						one: Number(summary.one ?? 0),
						two: Number(summary.two ?? 0),
						three: Number(summary.three ?? 0),
						four: Number(summary.four ?? 0),
						five: Number(summary.five ?? 0),
					},
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
