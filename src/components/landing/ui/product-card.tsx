import { Card } from "@heroui/react";
import { ImageOff, ShoppingCart, Star } from "lucide-react";
import type { AdminProductListItemType } from "#/server/catalog/products/products.types";

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
	>;
	badge?: { label: string; className: string };
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
			: `$${product.price.toLocaleString()}`;

	return (
		<Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
			{/* Image */}
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

				{/* Badge */}
				{badge && (
					<span
						className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${badge.className}`}
					>
						{badge.label}
					</span>
				)}

				{/* Discount badge */}
				{discount && (
					<span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full bg-danger text-danger-foreground">
						-{discount}%
					</span>
				)}
			</div>

			{/* Info */}
			<Card.Content className="p-4 flex flex-col gap-2">
				<div>
					<p className="text-xs text-muted font-medium uppercase tracking-wide">
						{product.brand}
					</p>
					<h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mt-0.5">
						{product.name}
					</h3>
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
								${product.compareAtPrice.toLocaleString()}
							</span>
						)}
					</div>
					<button
						type="button"
						className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
						aria-label="Add to cart"
					>
						<ShoppingCart size={16} />
					</button>
				</div>
			</Card.Content>
		</Card>
	);
}
