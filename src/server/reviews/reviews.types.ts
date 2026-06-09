import type { z } from "zod";
import type {
	createReviewSchema,
	deleteReviewSchema,
	getProductRatingSummarySchema,
	getReviewByIdSchema,
	listAllReviewsSchema,
	listMyReviewsSchema,
	listReviewsByProductSchema,
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

export type ReviewWithProductType = ReviewType & {
	product: {
		id: string;
		name: string;
		slug: string;
		image: string | null;
	};
};

export type ReviewWithCustomerAndProductType = ReviewType & {
	customer: {
		id: string;
		name: string;
		image: string | null;
	};
	product: {
		id: string;
		name: string;
		slug: string;
		image: string | null;
	};
};

export type ProductRatingSummaryType = {
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

export type ListReviewsByProductSchemaInputType = z.infer<
	typeof listReviewsByProductSchema
>;

export type ListMyReviewsSchemaInputType = z.infer<typeof listMyReviewsSchema>;

export type GetProductRatingSummarySchemaInputType = z.infer<
	typeof getProductRatingSummarySchema
>;

export type ListAllReviewsSchemaInputType = z.infer<
	typeof listAllReviewsSchema
>;

export type GetReviewByIdSchemaInputType = z.infer<typeof getReviewByIdSchema>;

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

export type ListReviewsByProductInputType = ListReviewsByProductSchemaInputType;

export type ListMyReviewsInputType = ListMyReviewsSchemaInputType & {
	userId: string;
};

export type GetProductRatingSummaryInputType =
	GetProductRatingSummarySchemaInputType;

export type ListAllReviewsInputType = ListAllReviewsSchemaInputType;

export type GetReviewByIdInputType = GetReviewByIdSchemaInputType;

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

export type ListReviewsByProductOutputType = {
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

export type ListMyReviewsOutputType = {
	items: ReviewWithProductType[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
};

export type GetProductRatingSummaryOutputType = {
	summary: ProductRatingSummaryType;
};

export type ListAllReviewsOutputType = {
	items: ReviewWithCustomerAndProductType[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
};

export type GetReviewByIdOutputType = {
	review: ReviewWithCustomerAndProductType;
};
