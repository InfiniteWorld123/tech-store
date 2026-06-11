import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveOrderAction } from "#/server/orders/admin/admin.actions";
import type {
	AdminOrderListItemType,
	ListOrdersOutputType,
	ToggleOrderArchiveInputType,
} from "#/server/orders/admin/admin.types";

type OrdersCache = { data: ListOrdersOutputType };

export function useArchiveOrder({
	onSuccess,
}: {
	onSuccess?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ToggleOrderArchiveInputType) =>
			archiveOrderAction({ data }),

		onMutate: async ({ orderId }) => {
			await queryClient.cancelQueries({ queryKey: ["orders"] });

			const previousQueries = queryClient.getQueriesData<OrdersCache>({
				queryKey: ["orders"],
			});

			queryClient.setQueriesData<OrdersCache>(
				{ queryKey: ["orders"] },
				(old) => {
					if (!old?.data?.items) return old;
					return {
						...old,
						data: {
							...old.data,
							items: old.data.items.filter(
								(item: AdminOrderListItemType) => item.id !== orderId,
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
			toast.danger(err.message || "Failed to archive order. Please try again.");
		},

		onSuccess: () => {
			toast.success("Order archived");
			onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
}
