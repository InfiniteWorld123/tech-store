import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";
import { createAddressAction } from "#/server/addresses/addresses.actions";
import type { createAddressSchema } from "#/server/addresses/addresses.schemas";

export function useCreateAddress({
	onSuccess,
}: {
	onSuccess?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: z.infer<typeof createAddressSchema>) =>
			createAddressAction({ data }),

		onSuccess: () => {
			toast.success("Address saved");
			queryClient.invalidateQueries({ queryKey: ["addresses"] });
			onSuccess?.();
		},

		onError: (err: Error) => {
			toast.danger(err.message || "Failed to save address. Please try again.");
		},
	});
}
