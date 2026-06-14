import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderOrderAction } from "#/server/orders/customer/customer.actions";

export function useReorderOrder({
	onSuccess,
}: {
	onSuccess?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ orderId }: { orderId: string }) =>
			reorderOrderAction({ data: { orderId } }),

		onSuccess: (result) => {
			const { addedCount, skippedCount } = result.data;
			if (skippedCount > 0) {
				toast.success(
					`${addedCount} item${addedCount !== 1 ? "s" : ""} added to cart (${skippedCount} unavailable)`,
				);
			} else {
				toast.success(
					`${addedCount} item${addedCount !== 1 ? "s" : ""} added to cart`,
				);
			}
			queryClient.invalidateQueries({ queryKey: ["cart"] });
			onSuccess?.();
		},

		onError: (err: Error) => {
			toast.danger(err.message || "Failed to reorder. Please try again.");
		},
	});
}
