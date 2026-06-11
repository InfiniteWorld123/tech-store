import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markOrderShippedAction } from "#/server/shipping/shipping.actions";
import type {
	ListShipmentsOutputType,
	MarkOrderShippedInputType,
	ShippingListItemType,
} from "#/server/shipping/shipping.types";

type ShipmentsCache = { data: ListShipmentsOutputType };

export function useMarkOrderShipped() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: MarkOrderShippedInputType) =>
			markOrderShippedAction({ data }),

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
											status: "shipped" as const,
											shippedAt: new Date().toISOString(),
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
				err.message || "Failed to mark order as shipped. Please try again.",
			);
		},

		onSuccess: () => {
			toast.success("Order marked as shipped");
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["shipments"] });
		},
	});
}
