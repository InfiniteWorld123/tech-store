import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";
import { createReviewAction } from "#/server/reviews/reviews.actions";
import type { createReviewSchema } from "#/server/reviews/reviews.schemas";

export function useCreateReview({
	onSuccess,
}: {
	onSuccess?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: z.infer<typeof createReviewSchema>) =>
			createReviewAction({ data }),

		onSuccess: (_result, variables) => {
			toast.success("Review submitted. Thank you!");
			queryClient.invalidateQueries({
				queryKey: ["reviews", "by-product", variables.productId],
			});
			queryClient.invalidateQueries({
				queryKey: ["reviews", "product-rating-summary", variables.productId],
			});
			queryClient.invalidateQueries({ queryKey: ["reviews", "my-reviews"] });
			onSuccess?.();
		},

		onError: (err: Error) => {
			toast.danger(err.message || "Failed to submit review. Please try again.");
		},
	});
}
