import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setDefaultAddressAction } from "#/server/addresses/addresses.actions";

export function useSetDefaultAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ addressId }: { addressId: string }) =>
			setDefaultAddressAction({ data: { addressId } }),

		onSuccess: () => {
			toast.success("Default address updated");
			queryClient.invalidateQueries({ queryKey: ["addresses"] });
		},

		onError: (err: Error) => {
			toast.danger(
				err.message || "Failed to update default address. Please try again.",
			);
		},
	});
}
