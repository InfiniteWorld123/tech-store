import type { z } from "zod";
import type {
	createReviewSchema,
	deleteReviewSchema,
	getReviewSummarySchema,
	listCustomerReviewsSchema,
	listProductReviewsSchema,
	reviewRatingSchema,
	updateReviewSchema,
} from "./reviews.schemas";

// helper types
export type ReviewType = {
	id: string;
	userId: string;
	productId: string;
	rating: number;
	title: string;
	comment: string;
	createdAt: string;
	updatedAt: string;
};

export type ReviewWithCustomerType = ReviewType & {
	customer: {
		id: string;
		name: string;
		image: string | null;
	};
};

export type CustomerReviewType = ReviewType & {
	product: {
		id: string;
		name: string;
		slug: string;
		image: string | null;
	};
};

export type ReviewSummaryType = {
	productId: string;
	averageRating: number;
	reviewsCount: number;
	ratingCounts: {
		one: number;
		two: number;
		three: number;
		four: number;
		five: number;
	};
};

// inferred types
export type CreateReviewSchemaInputType = z.infer<typeof createReviewSchema>;

export type ReviewRatingType = z.infer<typeof reviewRatingSchema>;

export type UpdateReviewSchemaInputType = z.infer<typeof updateReviewSchema>;

export type DeleteReviewSchemaInputType = z.infer<typeof deleteReviewSchema>;

export type ListProductReviewsSchemaInputType = z.infer<
	typeof listProductReviewsSchema
>;

export type ListCustomerReviewsSchemaInputType = z.infer<
	typeof listCustomerReviewsSchema
>;

export type GetReviewSummarySchemaInputType = z.infer<
	typeof getReviewSummarySchema
>;

// input types
export type CreateReviewInputType = CreateReviewSchemaInputType & {
	userId: string;
};

export type UpdateReviewInputType = UpdateReviewSchemaInputType & {
	userId: string;
};

export type DeleteReviewInputType = DeleteReviewSchemaInputType & {
	userId: string;
};

export type ListProductReviewsInputType = ListProductReviewsSchemaInputType;

export type ListCustomerReviewsInputType =
	ListCustomerReviewsSchemaInputType & {
		userId: string;
	};

export type GetReviewSummaryInputType = GetReviewSummarySchemaInputType;

// output types
export type CreateReviewOutputType = {
	review: ReviewType;
};

export type UpdateReviewOutputType = {
	review: ReviewType;
};

export type DeleteReviewOutputType = {
	reviewId: string;
	deleted: boolean;
};

export type ListProductReviewsOutputType = {
	items: ReviewWithCustomerType[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
};

export type ListCustomerReviewsOutputType = {
	items: CustomerReviewType[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
};

export type GetReviewSummaryOutputType = {
	summary: ReviewSummaryType;
};
