import { createServerFn } from "@tanstack/react-start";
import { ensureSession } from "../auth/ensure-session.middleware";
import {
	createReviewSchema,
	deleteReviewSchema,
	getReviewSummarySchema,
	listCustomerReviewsSchema,
	listProductReviewsSchema,
	updateReviewSchema,
} from "./reviews.schemas";
import { createReview } from "./services/create-review.service";
import { deleteReview } from "./services/delete-review.service";
import { getReviewSummary } from "./services/get-review-summary.service";
import { listCustomerReviews } from "./services/list-customer-reviews.service";
import { listProductReviews } from "./services/list-product-reviews.service";
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

export const listProductReviewsAction = createServerFn({ method: "GET" })
	.inputValidator(listProductReviewsSchema)
	.handler(async ({ data }) => {
		return listProductReviews(data);
	});

export const listCustomerReviewsAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(listCustomerReviewsSchema)
	.handler(async ({ context, data }) => {
		return listCustomerReviews({
			...data,
			userId: context.session.user.id,
		});
	});

export const getReviewSummaryAction = createServerFn({ method: "GET" })
	.inputValidator(getReviewSummarySchema)
	.handler(async ({ data }) => {
		return getReviewSummary(data);
	});
