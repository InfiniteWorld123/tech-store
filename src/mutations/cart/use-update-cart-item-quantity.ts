import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItemQuantityAction } from "#/server/cart/cart.actions";

export function useUpdateCartItemQuantity() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			variantId,
			quantity,
		}: {
			variantId: string;
			quantity: number;
		}) => updateCartItemQuantityAction({ data: { variantId, quantity } }),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},

		onError: (err: Error) => {
			toast.danger(
				err.message || "Failed to update quantity. Please try again.",
			);
		},
	});
}
