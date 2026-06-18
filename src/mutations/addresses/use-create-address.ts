import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";
import { createAddressAction } from "#/server/addresses/addresses.actions";
import type { createAddressSchema } from "#/server/addresses/addresses.schemas";
import type { AddressType } from "#/server/addresses/addresses.types";

export function useCreateAddress({
	onSuccess,
}: {
	onSuccess?: (address: AddressType) => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: z.infer<typeof createAddressSchema>) =>
			createAddressAction({ data }),

		onSuccess: (result) => {
			const createdAddress = result.data.address;

			toast.success("Address saved");
			queryClient.setQueryData(["addresses"], (current) => {
				if (!current || typeof current !== "object") return current;
				const currentData = current as {
					data?: { items?: AddressType[] };
				};
				const currentItems = currentData.data?.items ?? [];
				const nextItems = [
					createdAddress,
					...currentItems.filter((item) => item.id !== createdAddress.id),
				];

				return {
					...currentData,
					data: {
						...currentData.data,
						items: nextItems,
					},
				};
			});
			queryClient.invalidateQueries({ queryKey: ["addresses"] });
			onSuccess?.(createdAddress);
		},

		onError: (err: Error) => {
			toast.danger(err.message || "Failed to save address. Please try again.");
		},
	});
}
