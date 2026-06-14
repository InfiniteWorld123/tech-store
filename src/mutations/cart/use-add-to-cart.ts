import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCartAction } from "#/server/cart/cart.actions";

export function useAddToCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			variantId,
			quantity = 1,
		}: {
			variantId: string;
			quantity?: number;
		}) => addToCartAction({ data: { variantId, quantity } }),

		onSuccess: () => {
			toast.success("Added to cart");
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},

		onError: (err: Error) => {
			toast.danger(err.message || "Failed to add to cart. Please try again.");
		},
	});
}
