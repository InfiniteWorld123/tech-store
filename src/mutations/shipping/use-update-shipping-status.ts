import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShippingStatusAction } from "#/server/shipping/shipping.actions";
import type {
	ListShipmentsOutputType,
	ShippingListItemType,
	UpdateShippingStatusInputType,
} from "#/server/shipping/shipping.types";

type ShipmentsCache = { data: ListShipmentsOutputType };

export function useUpdateShippingStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateShippingStatusInputType) =>
			updateShippingStatusAction({ data }),

		onMutate: async ({ orderId, shippingStatus }) => {
			await queryClient.cancelQueries({ queryKey: ["shipments"] });

			const previousQueries = queryClient.getQueriesData<ShipmentsCache>({
				queryKey: ["shipments"],
			});

			queryClient.setQueriesData<ShipmentsCache>(
				{ queryKey: ["shipments"] },
				(old) => {
					if (!old?.data?.items) return old;
					return {
						...old,
						data: {
							...old.data,
							items: old.data.items.map((item: ShippingListItemType) =>
								item.orderId === orderId
									? { ...item, status: shippingStatus }
									: item,
							),
						},
					};
				},
			);

			return { previousQueries };
		},

		onError: (err: Error, _vars, context) => {
			context?.previousQueries?.forEach(([queryKey, data]) => {
				queryClient.setQueryData(queryKey, data);
			});
			toast.danger(
				err.message || "Failed to update shipping status. Please try again.",
			);
		},

		onSuccess: () => {
			toast.success("Shipping status updated");
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["shipments"] });
		},
	});
}
