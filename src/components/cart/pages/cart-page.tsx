"use client";

import { Button, Skeleton } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";
import { Footer } from "#/components/layout/footer";
import { Header } from "#/components/layout/header";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { getCartQueryOptions } from "#/queries/cart.queries";
import { listProductsQueryOptions } from "#/queries/products.queries";
import { clearCartAction } from "#/server/cart/cart.actions";
import type { GetProductsInputType } from "#/server/catalog/products/products.types";
import { CartItemRow } from "../sections/cart-item-row";
import { CartSummary } from "../sections/cart-summary";
import { CartWarningsBanner } from "../sections/cart-warnings-banner";

const catalogProductsInput = {
	pagination: { page: 1, limit: 12 },
	sorting: { sortBy: "createdAt", sortOrder: "desc" },
	flags: { isActive: true },
} satisfies GetProductsInputType;

export function CartPage() {
	const { data, isLoading } = useQuery(getCartQueryOptions);
	const cart = data?.data?.cart ?? null;
	const queryClient = useQueryClient();
	const { prefetch } = useQueryIntentPrefetch();

	const isGuest = !cart?.userId;
	const items = cart?.items ?? [];
	const warnings = cart?.warnings ?? [];
	const summary = cart?.summary;

	const handleClearCart = async () => {
		await clearCartAction({ data: {} });
		queryClient.invalidateQueries({ queryKey: ["cart"] });
	};
	const prefetchProducts = () =>
		prefetch(listProductsQueryOptions({ data: catalogProductsInput }));

	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 pt-24 pb-20">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between mb-8">
						<h1 className="text-2xl font-bold text-foreground">
							Your cart
							{summary && summary.itemsCount > 0 && (
								<span className="ml-2 text-lg text-muted font-normal">
									({summary.itemsCount}{" "}
									{summary.itemsCount === 1 ? "item" : "items"})
								</span>
							)}
						</h1>
						{items.length > 0 && (
							<Button
								variant="ghost"
								size="sm"
								onPress={handleClearCart}
								className="text-muted hover:text-danger"
							>
								Clear cart
							</Button>
						)}
					</div>

					{isLoading ? (
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							<div className="lg:col-span-2 space-y-4">
								{[1, 2, 3].map((i) => (
									<div key={i} className="flex gap-4">
										<Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
										<div className="flex-1 space-y-2">
											<Skeleton className="h-4 w-3/4 rounded" />
											<Skeleton className="h-3 w-1/2 rounded" />
											<Skeleton className="h-8 w-32 rounded-xl" />
										</div>
									</div>
								))}
							</div>
							<Skeleton className="h-64 rounded-2xl" />
						</div>
					) : items.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
							<div className="w-16 h-16 rounded-full bg-surface-secondary flex items-center justify-center">
								<ShoppingCart size={28} className="text-muted" />
							</div>
							<div>
								<p className="text-lg font-semibold text-foreground">
									Your cart is empty
								</p>
								<p className="text-sm text-muted mt-1">
									Add some products to get started.
								</p>
							</div>
							<LinkAnchor
								to="/products"
								onFocus={prefetchProducts}
								onMouseEnter={prefetchProducts}
							>
								<Button variant="primary">Browse products</Button>
							</LinkAnchor>
						</div>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* Items */}
							<div className="lg:col-span-2 space-y-4">
								<CartWarningsBanner warnings={warnings} />
								<div className="border border-border rounded-2xl px-4">
									{items.map((item) => (
										<CartItemRow key={item.id} item={item} />
									))}
								</div>
							</div>

							{/* Summary */}
							<div>
								{summary && <CartSummary summary={summary} isGuest={isGuest} />}
							</div>
						</div>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
}
