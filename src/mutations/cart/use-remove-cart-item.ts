import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCartItemAction } from "#/server/cart/cart.actions";

export function useRemoveCartItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ cartItemId }: { cartItemId: string }) =>
			removeCartItemAction({ data: { cartItemId } }),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},

		onError: (err: Error) => {
			toast.danger(err.message || "Failed to remove item. Please try again.");
		},
	});
}
