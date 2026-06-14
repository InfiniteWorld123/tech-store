"use client";

import { Button } from "@heroui/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { useRemoveCartItem } from "#/mutations/cart/use-remove-cart-item";
import { useUpdateCartItemQuantity } from "#/mutations/cart/use-update-cart-item-quantity";
import { getProductBySlugQueryOptions } from "#/queries/products.queries";
import type { CartItemType } from "#/server/cart/cart.types";

type Props = { item: CartItemType };

export function CartItemRow({ item }: Props) {
	const { mutate: remove, isPending: removing } = useRemoveCartItem();
	const { mutate: updateQty, isPending: updating } =
		useUpdateCartItemQuantity();
	const { getPrefetchHandlers } = useQueryIntentPrefetch();
	const productPrefetchHandlers = getPrefetchHandlers(
		getProductBySlugQueryOptions({ slug: item.product.slug }),
	);

	const variantLabel = [
		item.variant.options.color,
		item.variant.options.storage,
		item.variant.options.ram,
		item.variant.options.screenSize,
	]
		.filter(Boolean)
		.join(" · ");

	return (
		<div className="flex gap-4 py-4 border-b border-border last:border-0">
			{/* Image */}
			<LinkAnchor
				to="/products/$slug"
				params={{ slug: item.product.slug }}
				className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-surface-secondary block"
				onFocus={productPrefetchHandlers.onFocus}
				onMouseEnter={productPrefetchHandlers.onMouseEnter}
			>
				{item.product.image ? (
					<img
						src={item.product.image}
						alt={item.product.name}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full bg-border" />
				)}
			</LinkAnchor>

			{/* Info */}
			<div className="flex-1 min-w-0 flex flex-col gap-1">
				<LinkAnchor
					to="/products/$slug"
					params={{ slug: item.product.slug }}
					className="font-semibold text-sm text-foreground hover:text-accent transition-colors line-clamp-2"
					onFocus={productPrefetchHandlers.onFocus}
					onMouseEnter={productPrefetchHandlers.onMouseEnter}
				>
					{item.product.name}
				</LinkAnchor>
				{variantLabel && <p className="text-xs text-muted">{variantLabel}</p>}
				<p className="text-xs text-muted font-mono">SKU: {item.variant.sku}</p>

				<div className="flex items-center justify-between mt-auto pt-2">
					{/* Qty stepper */}
					<div className="flex items-center gap-1 border border-border rounded-xl overflow-hidden">
						<button
							type="button"
							onClick={() =>
								updateQty({
									variantId: item.variantId,
									quantity: item.quantity - 1,
								})
							}
							disabled={item.quantity <= 1 || updating}
							className="px-2 py-1.5 text-muted hover:text-foreground disabled:opacity-40 transition-colors"
						>
							<Minus size={12} />
						</button>
						<span className="w-7 text-center text-sm font-medium text-foreground">
							{item.quantity}
						</span>
						<button
							type="button"
							onClick={() =>
								updateQty({
									variantId: item.variantId,
									quantity: item.quantity + 1,
								})
							}
							disabled={item.quantity >= item.variant.stockQuantity || updating}
							className="px-2 py-1.5 text-muted hover:text-foreground disabled:opacity-40 transition-colors"
						>
							<Plus size={12} />
						</button>
					</div>

					{/* Price */}
					<div className="text-right">
						<p className="text-sm font-bold text-foreground">
							€{item.lineTotal.toLocaleString()}
						</p>
						{item.hasPriceChanged && (
							<p className="text-xs text-warning">
								Price changed (was €{item.priceAtTime.toLocaleString()})
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Remove */}
			<Button
				variant="ghost"
				size="sm"
				isIconOnly
				isPending={removing}
				onPress={() => remove({ cartItemId: item.id })}
				className="flex-shrink-0 text-muted hover:text-danger self-start"
			>
				<Trash2 size={14} />
			</Button>
		</div>
	);
}
