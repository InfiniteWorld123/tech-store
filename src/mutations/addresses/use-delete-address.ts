import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAddressAction } from "#/server/addresses/addresses.actions";

export function useDeleteAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ addressId }: { addressId: string }) =>
			deleteAddressAction({ data: { addressId } }),

		onSuccess: () => {
			toast.success("Address deleted");
			queryClient.invalidateQueries({ queryKey: ["addresses"] });
		},

		onError: (err: Error) => {
			toast.danger(
				err.message || "Failed to delete address. Please try again.",
			);
		},
	});
}
