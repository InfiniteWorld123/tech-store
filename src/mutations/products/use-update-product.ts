import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductAction } from "#/server/catalog/products/products.actions";
import type { UpdateProductInputType } from "#/server/catalog/products/products.types";

export function useUpdateProduct({
	onSuccess,
}: {
	onSuccess?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateProductInputType) => updateProductAction({ data }),

		onSuccess: (_result, variables) => {
			toast.success("Product updated successfully");
			queryClient.invalidateQueries({
				queryKey: ["products", "detail", variables.productId],
			});
			onSuccess?.();
		},

		onError: (err: Error) => {
			toast.danger(
				err.message || "Failed to update product. Please try again.",
			);
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}
