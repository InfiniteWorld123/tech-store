import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";
import { placeOrderFromCartAction } from "#/server/orders/customer/customer.actions";
import type { placeOrderFromCartSchema } from "#/server/orders/customer/customer.schemas";

export function usePlaceOrder({
	onSuccess,
}: {
	onSuccess?: (orderId: string) => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: z.infer<typeof placeOrderFromCartSchema>) =>
			placeOrderFromCartAction({ data }),

		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
			queryClient.invalidateQueries({ queryKey: ["orders", "customer"] });
			onSuccess?.(result.data.order.id);
		},

		onError: (err: Error) => {
			toast.danger(err.message || "Failed to place order. Please try again.");
		},
	});
}
