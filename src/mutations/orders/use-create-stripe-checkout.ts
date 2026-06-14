import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { createStripeCheckoutSessionAction } from "#/server/payments/payments.actions";

export function useCreateStripeCheckout() {
	return useMutation({
		mutationFn: ({ orderId }: { orderId: string }) =>
			createStripeCheckoutSessionAction({ data: { orderId } }),

		onSuccess: (result) => {
			const { checkoutUrl } = result.data;
			if (checkoutUrl) {
				window.location.href = checkoutUrl;
			}
		},

		onError: (err: Error) => {
			toast.danger(err.message || "Failed to start payment. Please try again.");
		},
	});
}
