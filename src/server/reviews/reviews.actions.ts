import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "../auth/ensure-session.middleware";
import {
	createReviewSchema,
	deleteReviewSchema,
	getProductRatingSummarySchema,
	getReviewByIdSchema,
	listAllReviewsSchema,
	listMyReviewsSchema,
	listReviewsByProductSchema,
	updateReviewSchema,
} from "./reviews.schemas";
import { createReview } from "./services/create-review.service";
import { deleteReview } from "./services/delete-review.service";
import { getProductRatingSummary } from "./services/get-product-rating-summary.service";
import { getReviewById } from "./services/get-review-by-id.service";
import { listAllReviews } from "./services/list-all-reviews.service";
import { listMyReviews } from "./services/list-my-reviews.service";
import { listReviewsByProduct } from "./services/list-reviews-by-product.service";
import { updateReview } from "./services/update-review.service";

export const createReviewAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(createReviewSchema)
	.handler(async ({ context, data }) => {
		return createReview({
			...data,
			userId: context.session.user.id,
		});
	});

export const updateReviewAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(updateReviewSchema)
	.handler(async ({ context, data }) => {
		return updateReview({
			...data,
			userId: context.session.user.id,
		});
	});

export const deleteReviewAction = createServerFn({ method: "POST" })
	.middleware([ensureSession])
	.inputValidator(deleteReviewSchema)
	.handler(async ({ context, data }) => {
		return deleteReview({
			...data,
			userId: context.session.user.id,
		});
	});

export const listReviewsByProductAction = createServerFn({ method: "GET" })
	.inputValidator(listReviewsByProductSchema)
	.handler(async ({ data }) => {
		return listReviewsByProduct(data);
	});

export const listMyReviewsAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(listMyReviewsSchema)
	.handler(async ({ context, data }) => {
		return listMyReviews({
			...data,
			userId: context.session.user.id,
		});
	});

export const getProductRatingSummaryAction = createServerFn({ method: "GET" })
	.inputValidator(getProductRatingSummarySchema)
	.handler(async ({ data }) => {
		return getProductRatingSummary(data);
	});

export const listAllReviewsAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(listAllReviewsSchema)
	.handler(async ({ data }) => {
		return listAllReviews(data);
	});

export const getReviewByIdAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(getReviewByIdSchema)
	.handler(async ({ data }) => {
		return getReviewById(data);
	});
