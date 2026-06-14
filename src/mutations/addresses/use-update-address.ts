import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";
import { updateAddressAction } from "#/server/addresses/addresses.actions";
import type { updateAddressSchema } from "#/server/addresses/addresses.schemas";

export function useUpdateAddress({
	onSuccess,
}: {
	onSuccess?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: z.infer<typeof updateAddressSchema>) =>
			updateAddressAction({ data }),

		onSuccess: () => {
			toast.success("Address updated");
			queryClient.invalidateQueries({ queryKey: ["addresses"] });
			onSuccess?.();
		},

		onError: (err: Error) => {
			toast.danger(
				err.message || "Failed to update address. Please try again.",
			);
		},
	});
}
