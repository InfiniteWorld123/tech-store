import { Button, Card, Chip } from "@heroui/react";
import { ImageOff, ShoppingCart, Star } from "lucide-react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { useAddToCart } from "#/mutations/cart/use-add-to-cart";
import { getProductBySlugQueryOptions } from "#/queries/products.queries";
import type { AdminProductListItemType } from "#/server/catalog/products/products.types";

type ProductBadgeColor =
	| "accent"
	| "success"
	| "warning"
	| "danger"
	| "default";

type Props = {
	product: Pick<
		AdminProductListItemType,
		| "id"
		| "name"
		| "brand"
		| "slug"
		| "image"
		| "price"
		| "compareAtPrice"
		| "ratingAvg"
		| "reviewsCount"
		| "defaultVariantId"
	>;
	badge?: { label: string; color?: ProductBadgeColor };
};

function StarRating({ value }: { value: number }) {
	return (
		<div className="flex items-center gap-1">
			{[1, 2, 3, 4, 5].map((i) => (
				<Star
					key={i}
					size={12}
					className={
						i <= Math.round(value)
							? "fill-warning text-warning"
							: "fill-default text-default"
					}
				/>
			))}
		</div>
	);
}

export function ProductCard({ product, badge }: Props) {
	const { mutate: addToCart, isPending } = useAddToCart();
	const { getPrefetchHandlers } = useQueryIntentPrefetch();
	const productPrefetchHandlers = getPrefetchHandlers(
		getProductBySlugQueryOptions({ slug: product.slug }),
	);

	const discount =
		product.compareAtPrice && product.price
			? Math.round(
					((product.compareAtPrice - product.price) / product.compareAtPrice) *
						100,
				)
			: null;
	const priceLabel =
		product.price === null
			? "Price unavailable"
			: `€${product.price.toLocaleString()}`;

	return (
		<Card
			className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
			onMouseEnter={productPrefetchHandlers.onMouseEnter}
		>
			<LinkAnchor
				to="/products/$slug"
				params={{ slug: product.slug }}
				className="block"
				onFocus={productPrefetchHandlers.onFocus}
			>
				<div className="relative bg-surface-secondary aspect-square flex items-center justify-center">
					{product.image ? (
						<img
							src={product.image}
							alt={product.name}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="flex flex-col items-center gap-2 text-muted">
							<ImageOff size={36} />
							<span className="text-xs">{product.brand}</span>
						</div>
					)}

					{badge && (
						<Chip
							size="sm"
							color={badge.color ?? "accent"}
							variant="primary"
							className="absolute top-3 left-3"
						>
							{badge.label}
						</Chip>
					)}

					{discount ? (
						<Chip
							size="sm"
							color="danger"
							variant="primary"
							className="absolute top-3 right-3"
						>
							-{discount}%
						</Chip>
					) : null}
				</div>
			</LinkAnchor>

			<Card.Content className="p-4 flex flex-col gap-2">
				<div>
					<p className="text-xs text-muted font-medium uppercase tracking-wide">
						{product.brand}
					</p>
					<LinkAnchor
						to="/products/$slug"
						params={{ slug: product.slug }}
						onFocus={productPrefetchHandlers.onFocus}
					>
						<h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mt-0.5 hover:text-accent transition-colors">
							{product.name}
						</h3>
					</LinkAnchor>
				</div>

				<div className="flex items-center gap-2">
					<StarRating value={product.ratingAvg} />
					<span className="text-xs text-muted">
						({product.reviewsCount.toLocaleString()})
					</span>
				</div>

				<div className="flex items-center justify-between mt-1">
					<div className="flex items-baseline gap-2">
						<span className="font-bold text-foreground">{priceLabel}</span>
						{product.compareAtPrice && (
							<span className="text-xs text-muted line-through">
								€{product.compareAtPrice.toLocaleString()}
							</span>
						)}
					</div>
					<Button
						type="button"
						isIconOnly
						size="sm"
						variant="secondary"
						aria-label="Add to cart"
						isPending={isPending}
						isDisabled={!product.defaultVariantId || product.price === null}
						onPress={() => {
							if (product.defaultVariantId) {
								addToCart({ variantId: product.defaultVariantId, quantity: 1 });
							}
						}}
					>
						<ShoppingCart size={16} />
					</Button>
				</div>
			</Card.Content>
		</Card>
	);
}
