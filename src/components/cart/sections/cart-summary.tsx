"use client";

import { Button } from "@heroui/react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { listAddressesQueryOptions } from "#/queries/addresses.queries";
import { getCartQueryOptions } from "#/queries/cart.queries";
import { listProductsQueryOptions } from "#/queries/products.queries";
import type { CartSummaryType } from "#/server/cart/cart.types";
import type { GetProductsInputType } from "#/server/catalog/products/products.types";

type Props = {
	summary: CartSummaryType;
	isGuest: boolean;
};

const catalogProductsInput = {
	pagination: { page: 1, limit: 12 },
	sorting: { sortBy: "createdAt", sortOrder: "desc" },
	flags: { isActive: true },
} satisfies GetProductsInputType;

export function CartSummary({ summary, isGuest }: Props) {
	const { prefetch } = useQueryIntentPrefetch();
	const prefetchCheckout = () => {
		if (isGuest) return;
		prefetch(getCartQueryOptions);
		prefetch(listAddressesQueryOptions);
	};
	const prefetchProducts = () =>
		prefetch(listProductsQueryOptions({ data: catalogProductsInput }));

	return (
		<div className="border border-border rounded-2xl p-5 space-y-4 sticky top-24">
			<h2 className="font-bold text-foreground text-lg">Order summary</h2>

			<div className="space-y-2 text-sm">
				<div className="flex justify-between text-muted">
					<span>
						Subtotal ({summary.itemsCount}{" "}
						{summary.itemsCount === 1 ? "item" : "items"})
					</span>
					<span className="text-foreground font-medium">
						€{summary.subtotal.toLocaleString()}
					</span>
				</div>
				<div className="flex justify-between text-muted">
					<span>Shipping</span>
					<span>Calculated at checkout</span>
				</div>
				<div className="flex justify-between text-muted">
					<span>Tax (19%)</span>
					<span>Calculated at checkout</span>
				</div>
			</div>

			<div className="border-t border-border pt-3 flex justify-between font-bold text-foreground">
				<span>Estimated total</span>
				<span>€{summary.subtotal.toLocaleString()}</span>
			</div>

			{isGuest ? (
				<div className="space-y-2">
					<p className="text-sm text-muted text-center">
						Sign in to proceed to checkout
					</p>
					<LinkAnchor
						to="/sign-in"
						search={{ redirect: "/checkout" }}
						className="block"
					>
						<Button variant="primary" className="w-full">
							Sign in to checkout
						</Button>
					</LinkAnchor>
				</div>
			) : (
				<LinkAnchor
					to="/checkout"
					className="block"
					onFocus={prefetchCheckout}
					onMouseEnter={prefetchCheckout}
				>
					<Button
						variant="primary"
						className="w-full"
						isDisabled={!summary.canCheckout}
					>
						Proceed to checkout
					</Button>
				</LinkAnchor>
			)}

			{!summary.canCheckout && !isGuest && (
				<p className="text-xs text-danger text-center">
					Some items are unavailable or out of stock. Remove them to continue.
				</p>
			)}

			<LinkAnchor
				to="/products"
				className="block text-center text-sm text-accent hover:underline"
				onFocus={prefetchProducts}
				onMouseEnter={prefetchProducts}
			>
				Continue shopping
			</LinkAnchor>
		</div>
	);
}
