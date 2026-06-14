import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVariantAction } from "#/server/catalog/variants/variants.actions";
import type { UpdateVariantInputType } from "#/server/catalog/variants/variants.types";

export function useUpdateVariant({
	onSuccess,
	productId,
}: {
	onSuccess?: () => void;
	productId?: string;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateVariantInputType) => updateVariantAction({ data }),

		onSuccess: () => {
			toast.success("Variant updated successfully");
			if (productId) {
				queryClient.invalidateQueries({
					queryKey: ["products", "detail", productId],
				});
			}
			onSuccess?.();
		},

		onError: (err: Error) => {
			toast.danger(
				err.message || "Failed to update variant. Please try again.",
			);
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}
