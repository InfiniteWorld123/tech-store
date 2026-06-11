import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markOrderDeliveredAction } from "#/server/shipping/shipping.actions";
import type {
	ListShipmentsOutputType,
	MarkOrderDeliveredInputType,
	ShippingListItemType,
} from "#/server/shipping/shipping.types";

type ShipmentsCache = { data: ListShipmentsOutputType };

export function useMarkOrderDelivered() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: MarkOrderDeliveredInputType) =>
			markOrderDeliveredAction({ data }),

		onMutate: async ({ orderId }) => {
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
									? {
											...item,
											status: "delivered" as const,
											deliveredAt: new Date().toISOString(),
										}
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
				err.message || "Failed to mark order as delivered. Please try again.",
			);
		},

		onSuccess: () => {
			toast.success("Order marked as delivered");
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["shipments"] });
		},
	});
}
