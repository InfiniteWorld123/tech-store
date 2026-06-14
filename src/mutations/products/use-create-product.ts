import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductAction } from "#/server/catalog/products/products.actions";
import type { CreateProductInputType } from "#/server/catalog/products/products.types";

export function useCreateProduct({
	onSuccess,
}: {
	onSuccess?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateProductInputType) => createProductAction({ data }),

		onSuccess: () => {
			toast.success("Product created successfully");
			onSuccess?.();
		},

		onError: (err: Error) => {
			toast.danger(
				err.message || "Failed to create product. Please try again.",
			);
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}
