import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVariantAction } from "#/server/catalog/variants/variants.actions";
import type { CreateVariantInputType } from "#/server/catalog/variants/variants.types";

export function useCreateVariant({
	onSuccess,
}: {
	onSuccess?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateVariantInputType) => createVariantAction({ data }),

		onSuccess: (_result, variables) => {
			toast.success("Variant created successfully");
			queryClient.invalidateQueries({
				queryKey: ["products", "detail", variables.productId],
			});
			onSuccess?.();
		},

		onError: (err: Error) => {
			toast.danger(
				err.message || "Failed to create variant. Please try again.",
			);
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}
