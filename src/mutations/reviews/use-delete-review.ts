import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReviewAction } from "#/server/reviews/reviews.actions";

export function useDeleteReview({
	onSuccess,
}: {
	onSuccess?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ reviewId }: { reviewId: string }) =>
			deleteReviewAction({ data: { reviewId } }),

		onSuccess: () => {
			toast.success("Review deleted");
			queryClient.invalidateQueries({ queryKey: ["reviews"] });
			onSuccess?.();
		},

		onError: (err: Error) => {
			toast.danger(err.message || "Failed to delete review. Please try again.");
		},
	});
}
