import { avg, count, sql, sum } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { product, variant } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	GetProductMetricsInputType,
	GetProductMetricsOutputType,
} from "../analytics.types";

export const getProductMetrics = async (
	_data: GetProductMetricsInputType,
): Promise<JsonOk<GetProductMetricsOutputType>> => {
	try {
		const [productStats] = await db
			.select({
				totalProducts: count(),
				activeProducts: sql<number>`count(*) filter (where ${product.isActive} = true)`,
				featuredProducts: sql<number>`count(*) filter (where ${product.isFeatured} = true)`,
				bestsellerProducts: sql<number>`count(*) filter (where ${product.isBestseller} = true)`,
				averageProductRating: avg(product.ratingAvg),
				totalReviewsAcrossProducts: sum(product.reviewsCount),
				productsWithNoReviews: sql<number>`count(*) filter (where ${product.reviewsCount} = 0)`,
				inactiveProducts: sql<number>`count(*) filter (where ${product.isActive} = false)`,
			})
			.from(product);

		const [variantStats] = await db
			.select({
				totalVariants: count(),
				outOfStockVariants: sql<number>`count(*) filter (where ${variant.stockQuantity} = 0)`,
				lowStockVariants: sql<number>`count(*) filter (where ${variant.stockQuantity} > 0 and ${variant.stockQuantity} < 10)`,
				productsWithDiscount: sql<number>`count(*) filter (where ${variant.compareAtPrice} is not null)`,
			})
			.from(variant);

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Product metrics fetched successfully",
			data: {
				totalProducts: productStats.totalProducts,
				activeProducts: productStats.activeProducts,
				inactiveProducts: productStats.inactiveProducts,
				featuredProducts: productStats.featuredProducts,
				bestsellerProducts: productStats.bestsellerProducts,
				totalVariants: variantStats.totalVariants,
				outOfStockVariants: variantStats.outOfStockVariants,
				lowStockVariants: variantStats.lowStockVariants,
				averageProductRating: Number(productStats.averageProductRating ?? 0),
				totalReviewsAcrossProducts: Number(
					productStats.totalReviewsAcrossProducts ?? 0,
				),
				productsWithNoReviews: productStats.productsWithNoReviews,
				productsWithDiscount: variantStats.productsWithDiscount,
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
