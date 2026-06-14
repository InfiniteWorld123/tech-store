"use client";

import { Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { estimateOrderTotalQueryOptions } from "#/queries/orders.queries";

type Props = {
	addressId: string | null;
	shippingMethod: "standard" | "express" | "same_day";
};

export function CheckoutOrderSummary({ addressId, shippingMethod }: Props) {
	const { data, isLoading } = useQuery({
		...estimateOrderTotalQueryOptions({
			addressId: addressId ?? "",
			shippingMethod,
		}),
		enabled: !!addressId,
	});

	const estimate = data?.data;

	if (!addressId) {
		return (
			<div className="border border-border rounded-2xl p-5 space-y-3">
				<h3 className="font-bold text-foreground">Order summary</h3>
				<p className="text-sm text-muted">
					Select an address to see estimated total.
				</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="border border-border rounded-2xl p-5 space-y-3">
				<h3 className="font-bold text-foreground">Order summary</h3>
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex justify-between">
						<Skeleton className="h-3 w-24 rounded" />
						<Skeleton className="h-3 w-12 rounded" />
					</div>
				))}
			</div>
		);
	}

	if (!estimate) return null;

	const { summary, items } = estimate;

	return (
		<div className="border border-border rounded-2xl p-5 space-y-4 sticky top-24">
			<h3 className="font-bold text-foreground">Order summary</h3>

			{/* Items */}
			<div className="space-y-2 max-h-52 overflow-y-auto">
				{items.map((item) => (
					<div key={item.variantId} className="flex items-start gap-2">
						{item.image && (
							<img
								src={item.image}
								alt={item.productName}
								className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
							/>
						)}
						<div className="flex-1 min-w-0">
							<p className="text-xs font-medium text-foreground truncate">
								{item.productName}
							</p>
							<p className="text-xs text-muted">
								{item.variantName} × {item.quantity}
							</p>
						</div>
						<p className="text-xs font-semibold text-foreground flex-shrink-0">
							€{item.totalPrice.toLocaleString()}
						</p>
					</div>
				))}
			</div>

			<div className="border-t border-border pt-3 space-y-2 text-sm">
				<div className="flex justify-between text-muted">
					<span>Subtotal</span>
					<span>€{summary.subtotal.toLocaleString()}</span>
				</div>
				<div className="flex justify-between text-muted">
					<span>Shipping</span>
					<span>
						{summary.shippingFee === 0
							? "Free"
							: `€${summary.shippingFee.toLocaleString()}`}
					</span>
				</div>
				<div className="flex justify-between text-muted">
					<span>Tax (19%)</span>
					<span>€{summary.taxAmount.toLocaleString()}</span>
				</div>
				<div className="flex justify-between font-bold text-foreground pt-2 border-t border-border">
					<span>Total</span>
					<span>€{summary.totalAmount.toLocaleString()}</span>
				</div>
			</div>
		</div>
	);
}
