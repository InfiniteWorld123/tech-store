import { z } from "zod";

export const reviewRatingSchema = z
	.number()
	.min(1, "Rating must be at least 1")
	.max(5, "Rating cannot be greater than 5");

export const createReviewSchema = z.object({
	productId: z.uuid("Product id must be a valid UUID"),
	rating: reviewRatingSchema,
	title: z
		.string()
		.trim()
		.min(1, "Review title is required")
		.max(100, "Review title cannot be longer than 100 characters"),
	comment: z
		.string()
		.trim()
		.min(1, "Review comment is required")
		.max(1000, "Review comment cannot be longer than 1000 characters"),
});

export const updateReviewSchema = z.object({
	reviewId: z.uuid("Review id must be a valid UUID"),
	rating: reviewRatingSchema.optional(),
	title: z
		.string()
		.trim()
		.min(1, "Review title is required")
		.max(100, "Review title cannot be longer than 100 characters")
		.optional(),
	comment: z
		.string()
		.trim()
		.min(1, "Review comment is required")
		.max(1000, "Review comment cannot be longer than 1000 characters")
		.optional(),
});

export const deleteReviewSchema = z.object({
	reviewId: z.uuid("Review id must be a valid UUID"),
});

export const listReviewsByProductSchema = z.object({
	productId: z.uuid("Product id must be a valid UUID"),
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(50).default(10),
});

export const listMyReviewsSchema = z.object({
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(50).default(10),
});

export const getProductRatingSummarySchema = z.object({
	productId: z.uuid("Product id must be a valid UUID"),
});

export const listAllReviewsSchema = z.object({
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(50).default(10),
	search: z.string().trim().max(100).optional(),
	rating: z.number().int().min(1).max(5).optional(),
});

export const getReviewByIdSchema = z.object({
	reviewId: z.uuid("Review id must be a valid UUID"),
});
