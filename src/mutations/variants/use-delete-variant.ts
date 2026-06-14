import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVariantAction } from "#/server/catalog/variants/variants.actions";
import type { DeleteVariantInputType } from "#/server/catalog/variants/variants.types";

export function useDeleteVariant({
	onSuccess,
	productId,
}: {
	onSuccess?: () => void;
	productId?: string;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: DeleteVariantInputType) => deleteVariantAction({ data }),

		onSuccess: (result) => {
			toast.success("Variant deleted successfully");
			const affectedProductId = result.data.productId ?? productId;
			if (affectedProductId) {
				queryClient.invalidateQueries({
					queryKey: ["products", "detail", affectedProductId],
				});
			}
			onSuccess?.();
		},

		onError: (err: Error) => {
			toast.danger(
				err.message || "Failed to delete variant. Please try again.",
			);
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}
