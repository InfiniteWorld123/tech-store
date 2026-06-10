import { queryOptions } from "@tanstack/react-query";
import {
    getProductRatingSummaryAction,
    getReviewByIdAction,
    listAllReviewsAction,
    listMyReviewsAction,
    listReviewsByProductAction,
} from "#/server/reviews/reviews.actions";

export const listReviewsByProductQueryOptions = ({ productId }: { productId: string }) =>
    queryOptions({
        queryKey: ["reviews", "by-product", productId],
        queryFn: () => listReviewsByProductAction({ data: { productId } }),
    });

export const listMyReviewsQueryOptions = () =>
    queryOptions({
        queryKey: ["reviews", "my-reviews"],
        queryFn: () => listMyReviewsAction({ data: {} }),
    });

export const productRatingSummaryQueryOptions = ({ productId }: { productId: string }) =>
    queryOptions({
        queryKey: ["reviews", "product-rating-summary", productId],
        queryFn: () => getProductRatingSummaryAction({ data: { productId } }),
    });

export const listAllReviewsQueryOptions = ({
    limit,
    page,
    search,
    rating,
}: {
    limit?: number;
    page?: number;
    search?: string;
    rating?: number;
}) =>
    queryOptions({
        queryKey: ["reviews", "all-reviews", search, rating, limit, page],
        queryFn: () => listAllReviewsAction({ data: { search, rating, limit, page } }),
    });

export const reviewByIdQueryOptions = ({ reviewId }: { reviewId: string }) =>
    queryOptions({
        queryKey: ["reviews", "by-id", reviewId],
        queryFn: () => getReviewByIdAction({ data: { reviewId } }),
    });
