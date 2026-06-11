import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatusAction } from "#/server/orders/admin/admin.actions";
import type {
	AdminOrderListItemType,
	ListOrdersOutputType,
	UpdateOrderStatusInputType,
} from "#/server/orders/admin/admin.types";

type OrdersCache = { data: ListOrdersOutputType };

export function useUpdateOrderStatus({
	onSuccess,
}: {
	onSuccess?: () => void;
} = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateOrderStatusInputType) =>
			updateOrderStatusAction({ data }),

		onMutate: async ({ orderId, orderStatus }) => {
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
							items: old.data.items.map((item: AdminOrderListItemType) =>
								item.id === orderId ? { ...item, status: orderStatus } : item,
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
				err.message || "Failed to update order status. Please try again.",
			);
		},

		onSuccess: () => {
			toast.success("Order status updated");
			onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});
}
