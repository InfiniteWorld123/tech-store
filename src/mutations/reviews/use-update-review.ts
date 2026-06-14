import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";
import { updateReviewAction } from "#/server/reviews/reviews.actions";
import type { updateReviewSchema } from "#/server/reviews/reviews.schemas";

export function useUpdateReview({
	onSuccess,
}: {
	onSuccess?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: z.infer<typeof updateReviewSchema>) =>
			updateReviewAction({ data }),

		onSuccess: () => {
			toast.success("Review updated");
			queryClient.invalidateQueries({ queryKey: ["reviews"] });
			onSuccess?.();
		},

		onError: (err: Error) => {
			toast.danger(err.message || "Failed to update review. Please try again.");
		},
	});
}
