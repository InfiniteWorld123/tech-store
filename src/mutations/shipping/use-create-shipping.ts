import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShippingAction } from "#/server/shipping/shipping.actions";
import type { CreateShippingInputType } from "#/server/shipping/shipping.types";

export function useCreateShipping() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateShippingInputType) =>
			createShippingAction({ data }),

		onSuccess: () => {
			toast.success("Shipment created successfully");
		},

		onError: (err: Error) => {
			toast.danger(
				err.message || "Failed to create shipment. Please try again.",
			);
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["shipments"] });
		},
	});
}
