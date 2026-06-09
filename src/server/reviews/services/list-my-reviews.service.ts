import { count, desc, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { product, review } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	ListMyReviewsInputType,
	ListMyReviewsOutputType,
} from "../reviews.types";

export const listMyReviews = async (
	data: ListMyReviewsInputType,
): Promise<JsonOk<ListMyReviewsOutputType>> => {
	try {
		const { limit, page, userId } = data;
		const offset = (page - 1) * limit;

		const [totalRow] = await db
			.select({ total: count(review.id) })
			.from(review)
			.where(eq(review.userId, userId));

		const rows = await db
			.select({
				id: review.id,
				userId: review.userId,
				productId: review.productId,
				rating: review.rating,
				title: review.title,
				comment: review.comment,
				createdAt: review.createdAt,
				updatedAt: review.updatedAt,
				productName: product.name,
				productSlug: product.slug,
				productImage: product.image,
			})
			.from(review)
			.innerJoin(product, eq(product.id, review.productId))
			.where(eq(review.userId, userId))
			.orderBy(desc(review.createdAt))
			.limit(limit)
			.offset(offset);

		const total = totalRow.total;
		const totalPages = Math.ceil(total / limit);

		return jsonOk<ListMyReviewsOutputType>({
			status: HttpStatusCode.OK,
			message: "My reviews fetched successfully",
			data: {
				items: rows.map((row) => ({
					id: row.id,
					userId: row.userId,
					productId: row.productId,
					rating: Number(row.rating),
					title: row.title,
					comment: row.comment,
					createdAt: row.createdAt.toISOString(),
					updatedAt: row.updatedAt.toISOString(),
					product: {
						id: row.productId,
						name: row.productName,
						slug: row.productSlug,
						image: row.productImage,
					},
				})),
				pagination: {
					page,
					limit,
					total,
					totalPages,
					hasNextPage: page < totalPages,
					hasPreviousPage: page > 1,
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
