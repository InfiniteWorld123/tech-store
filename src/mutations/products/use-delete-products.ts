import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductsAction } from "#/server/catalog/products/products.actions";
import type { DeleteProductsInputType } from "#/server/catalog/products/products.types";

export function useDeleteProducts({
	onSuccess,
}: {
	onSuccess?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: DeleteProductsInputType) =>
			deleteProductsAction({ data }),

		onSuccess: (_result, variables) => {
			toast.success("Products deleted successfully");
			for (const productId of variables.productIds) {
				queryClient.removeQueries({
					queryKey: ["products", "detail", productId],
				});
			}
			onSuccess?.();
		},

		onError: (err: Error) => {
			toast.danger(
				err.message || "Failed to delete products. Please try again.",
			);
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}
