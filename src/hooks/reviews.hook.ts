import { getReviewMetricsAction } from "#/server/analytics/analytics.actions";
import {
	getProductRatingSummaryAction,
	getReviewByIdAction,
	listAllReviewsAction,
	listMyReviewsAction,
	listReviewsByProductAction,
} from "#/server/reviews/reviews.actions";
import { queryOptions } from "@tanstack/react-query";

export const useListReviewsByProductQueryOptions = ({ productId }: { productId: string }) =>
	queryOptions({
		queryKey: ["reviews", "by-product", productId],
		queryFn: () => listReviewsByProductAction({ data: { productId } }),
	});

export const useListMyReviewsQueryOptions = () =>
	queryOptions({
		queryKey: ["reviews", "my-reviews"],
		queryFn: () => listMyReviewsAction({ data: {} }),
	});

export const useGetProductRatingSummaryQueryOptions = ({ productId }: { productId: string }) =>
	queryOptions({
		queryKey: ["reviews", "product-rating-summary", productId],
		queryFn: () => getProductRatingSummaryAction({ data: { productId } }),
	});

export const useListAllReviewsQueryOptions = ({ limit, page, search, rating }:
	{ limit?: number, page?: number, search?: string, rating?: number }) =>
	queryOptions({
		queryKey: ["reviews", "all-reviews", search, rating, limit, page],
		queryFn: () => listAllReviewsAction({ data: { search, rating, limit, page } }),
	});

export const useGetReviewByIdQueryOptions = ({ reviewId }: { reviewId: string }) =>
	queryOptions({
		queryKey: ["reviews", "by-id", reviewId],
		queryFn: () => getReviewByIdAction({ data: { reviewId } }),
	});

export const useGetReviewMetricsQueryOptions = () =>
	queryOptions({
		queryKey: ["analytics", "review-metrics"],
		queryFn: () => getReviewMetricsAction({ data: {} }),
	});
