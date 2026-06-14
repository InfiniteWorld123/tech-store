import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrderAction } from "#/server/orders/customer/customer.actions";

export function useCancelOrder({ onSuccess }: { onSuccess?: () => void } = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ orderId }: { orderId: string }) =>
			cancelOrderAction({ data: { orderId } }),

		onSuccess: (_result, variables) => {
			toast.success("Order cancelled");
			queryClient.invalidateQueries({ queryKey: ["orders", "customer"] });
			queryClient.invalidateQueries({
				queryKey: ["orders", "customer", "detail", variables.orderId],
			});
			onSuccess?.();
		},

		onError: (err: Error) => {
			toast.danger(err.message || "Failed to cancel order. Please try again.");
		},
	});
}
