import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductAction } from "#/server/catalog/products/products.actions";
import type { DeleteProductInputType } from "#/server/catalog/products/products.types";

export function useDeleteProduct({
	onSuccess,
}: {
	onSuccess?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: DeleteProductInputType) => deleteProductAction({ data }),

		onSuccess: (_result, variables) => {
			toast.success("Product deleted successfully");
			queryClient.removeQueries({
				queryKey: ["products", "detail", variables.productId],
			});
			onSuccess?.();
		},

		onError: (err: Error) => {
			toast.danger(
				err.message || "Failed to delete product. Please try again.",
			);
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}
