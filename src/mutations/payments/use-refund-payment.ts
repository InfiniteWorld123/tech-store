import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refundPaymentAction } from "#/server/payments/payments.actions";
import type {
	ListPaymentsOutputType,
	PaymentListItemType,
} from "#/server/payments/payments.types";

type PaymentsCache = {
	data: ListPaymentsOutputType;
};

export function useRefundPayment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { orderId: string }) => refundPaymentAction({ data }),

		onMutate: async ({ orderId }) => {
			await queryClient.cancelQueries({ queryKey: ["payments"] });

			const previousQueries = queryClient.getQueriesData<PaymentsCache>({
				queryKey: ["payments"],
			});

			queryClient.setQueriesData<PaymentsCache>(
				{ queryKey: ["payments"] },
				(old) => {
					if (!old?.data?.items) return old;
					return {
						...old,
						data: {
							...old.data,
							items: old.data.items.map((item: PaymentListItemType) =>
								item.orderId === orderId
									? { ...item, status: "refunded" as const }
									: item,
							),
						},
					};
				},
			);

			return { previousQueries };
		},

		onError: (err, _vars, context) => {
			context?.previousQueries?.forEach(([queryKey, data]) => {
				queryClient.setQueryData(queryKey, data);
			});
			toast.danger(
				err.message || "Failed to process refund. Please try again.",
			);
		},

		onSuccess: () => {
			toast.success("Payment refunded successfully");
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["payments"] });
		},
	});
}
