"use client";

import { Button } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { Footer } from "#/components/layout/footer";
import { Header } from "#/components/layout/header";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { useCreateStripeCheckout } from "#/mutations/orders/use-create-stripe-checkout";
import { usePlaceOrder } from "#/mutations/orders/use-place-order";
import { listAddressesQueryOptions } from "#/queries/addresses.queries";
import { estimateOrderTotalQueryOptions } from "#/queries/orders.queries";
import type { AddressType } from "#/server/addresses/addresses.types";
import { placeOrderFromCartSchema } from "#/server/orders/customer/customer.schemas";
import { AddressSelector } from "../sections/address-selector";
import { CheckoutOrderSummary } from "../sections/checkout-order-summary";
import { InlineAddressForm } from "../sections/inline-address-form";
import { PaymentMethodPicker } from "../sections/payment-method-picker";
import { ShippingMethodPicker } from "../sections/shipping-method-picker";

type ShippingMethod = "standard" | "express" | "same_day";
type PaymentMethod = "card" | "paypal" | "bank_transfer" | "cash_on_delivery";

const checkoutFormSchema = placeOrderFromCartSchema.extend({
	notes: z.string().trim().optional(),
});

export function CheckoutPage() {
	const navigate = useNavigate();
	const { prefetch } = useQueryIntentPrefetch();

	const { data: addressesData } = useQuery(listAddressesQueryOptions);
	const addresses: AddressType[] = addressesData?.data?.items ?? [];

	const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
	const hasInitializedAddress = useRef(false);
	const paymentMethodRef = useRef<PaymentMethod>("card");
	const { mutate: createStripeCheckout, isPending: isStartingStripe } =
		useCreateStripeCheckout();

	const { mutateAsync: placeOrder, isPending } = usePlaceOrder({
		onSuccess: (orderId) => {
			if (paymentMethodRef.current === "card") {
				createStripeCheckout({ orderId });
				return;
			}

			navigate({ to: "/account/orders/$orderId", params: { orderId } });
		},
	});

	const form = useForm({
		defaultValues: {
			addressId: defaultAddress?.id ?? "",
			shippingMethod: "standard" as ShippingMethod,
			paymentMethod: "card" as PaymentMethod,
			notes: "",
		},
		validators: {
			onSubmit: checkoutFormSchema,
		},
		onSubmit: async ({ value }) => {
			if (!value.addressId) return;
			paymentMethodRef.current = value.paymentMethod;
			await placeOrder({
				addressId: value.addressId,
				paymentMethod: value.paymentMethod,
				shippingMethod: value.shippingMethod,
				shippingCarrier: "dhl",
				notes: value.notes.trim() || undefined,
			});
		},
	});
	const { Field, Subscribe, handleSubmit, setFieldValue } = form;

	useEffect(() => {
		if (!defaultAddress?.id || hasInitializedAddress.current) return;
		setFieldValue("addressId", defaultAddress.id);
		hasInitializedAddress.current = true;
	}, [defaultAddress?.id, setFieldValue]);

	const prefetchEstimate = (
		addressId: string | null,
		shippingMethod: ShippingMethod,
	) => {
		if (!addressId) return;
		prefetch(estimateOrderTotalQueryOptions({ addressId, shippingMethod }));
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 pt-24 pb-20">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					<h1 className="text-2xl font-bold text-foreground mb-8">Checkout</h1>

					<form
						onSubmit={(event) => {
							event.preventDefault();
							handleSubmit();
						}}
					>
						<Subscribe>
							{({ values, isSubmitting }) => (
								<div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
									<div className="lg:col-span-3 space-y-8">
										<section className="space-y-4">
											<h2 className="font-bold text-foreground text-lg">
												Shipping address
											</h2>
											{addresses.length === 0 ? (
												<InlineAddressForm
													onSuccess={() => {
														// query invalidation handled by mutation; parent will re-render
													}}
												/>
											) : (
												<AddressSelector
													addresses={addresses}
													selectedId={values.addressId || null}
													onSelect={(id) => setFieldValue("addressId", id)}
													onPrefetchAddress={(id) =>
														prefetchEstimate(id, values.shippingMethod)
													}
												/>
											)}
										</section>

										<section className="space-y-4">
											<h2 className="font-bold text-foreground text-lg">
												Shipping method
											</h2>
											<ShippingMethodPicker
												value={values.shippingMethod}
												onChange={(method) => {
													setFieldValue("shippingMethod", method);
													prefetchEstimate(values.addressId || null, method);
												}}
												onPrefetch={(method) =>
													prefetchEstimate(values.addressId || null, method)
												}
											/>
										</section>

										<section className="space-y-4">
											<h2 className="font-bold text-foreground text-lg">
												Payment method
											</h2>
											<PaymentMethodPicker
												value={values.paymentMethod}
												onChange={(method) =>
													setFieldValue("paymentMethod", method)
												}
											/>
										</section>

										<section className="space-y-2">
											<h2 className="font-bold text-foreground text-lg">
												Order notes{" "}
												<span className="text-sm font-normal text-muted">
													(optional)
												</span>
											</h2>
											<Field name="notes">
												{(field) => (
													<textarea
														value={field.state.value}
														onChange={(e) => field.handleChange(e.target.value)}
														placeholder="Any special instructions for your order?"
														rows={3}
														className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-surface text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none transition-all"
													/>
												)}
											</Field>
										</section>

										<Button
											type="submit"
											variant="primary"
											className="w-full"
											isPending={isSubmitting || isPending || isStartingStripe}
											isDisabled={!values.addressId}
										>
											{values.paymentMethod === "card"
												? "Continue to Stripe"
												: "Place order"}
										</Button>
									</div>

									<div className="lg:col-span-2">
										<CheckoutOrderSummary
											addressId={values.addressId || null}
											shippingMethod={values.shippingMethod}
										/>
									</div>
								</div>
							)}
						</Subscribe>
					</form>
				</div>
			</main>

			<Footer />
		</div>
	);
}
