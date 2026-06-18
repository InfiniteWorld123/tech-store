import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmOrderPaymentAction } from "#/server/payments/payments.actions";

export function useConfirmPayment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { orderId: string }) =>
			confirmOrderPaymentAction({ data }),

		onSuccess: (result, { orderId }) => {
			if (!result.data.confirmed) return;

			queryClient.invalidateQueries({
				queryKey: ["orders", "customer", "detail", orderId],
			});
			queryClient.invalidateQueries({
				queryKey: ["payments", "detail", orderId],
			});
			queryClient.invalidateQueries({
				queryKey: ["orders", "customer", "list"],
			});
		},
	});
}
