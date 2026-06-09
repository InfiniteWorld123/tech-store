import { and, count, desc, eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { product, review, user } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	ListReviewsByProductInputType,
	ListReviewsByProductOutputType,
} from "../reviews.types";

export const listReviewsByProduct = async (
	data: ListReviewsByProductInputType,
): Promise<JsonOk<ListReviewsByProductOutputType>> => {
	try {
		const { limit, page, productId } = data;
		const offset = (page - 1) * limit;

		const [existingProduct] = await db
			.select({ id: product.id })
			.from(product)
			.where(and(eq(product.id, productId), eq(product.isActive, true)));

		if (!existingProduct) {
			throw notFoundError("Product not found");
		}

		const [totalRow] = await db
			.select({ total: count(review.id) })
			.from(review)
			.where(eq(review.productId, productId));

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
			})
			.from(review)
			.innerJoin(user, eq(user.id, review.userId))
			.where(eq(review.productId, productId))
			.orderBy(desc(review.createdAt))
			.limit(limit)
			.offset(offset);

		const total = totalRow.total;
		const totalPages = Math.ceil(total / limit);

		return jsonOk<ListReviewsByProductOutputType>({
			status: HttpStatusCode.OK,
			message: "Product reviews fetched successfully",
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
