import { and, count, desc, eq, ilike } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { product, review, user } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	ListAllReviewsInputType,
	ListAllReviewsOutputType,
} from "../reviews.types";

export const listAllReviews = async (
	data: ListAllReviewsInputType,
): Promise<JsonOk<ListAllReviewsOutputType>> => {
	try {
		const { limit, page, search, rating } = data;
		const offset = (page - 1) * limit;

		const conditions = [
			search ? ilike(review.title, `%${search}%`) : undefined,
			rating ? eq(review.rating, rating.toString()) : undefined,
		].filter((condition) => condition !== undefined);

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		const [totalRow] = await db
			.select({ total: count(review.id) })
			.from(review)
			.where(whereClause);

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
			.where(whereClause)
			.orderBy(desc(review.createdAt))
			.limit(limit)
			.offset(offset);

		const total = totalRow.total;
		const totalPages = Math.ceil(total / limit);

		return jsonOk<ListAllReviewsOutputType>({
			status: HttpStatusCode.OK,
			message: "Reviews fetched successfully",
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
