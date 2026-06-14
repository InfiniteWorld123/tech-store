"use client";

import { Button } from "@heroui/react";
import { Edit2, Star, Trash2 } from "lucide-react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { getProductBySlugQueryOptions } from "#/queries/products.queries";
import type { ReviewWithProductType } from "#/server/reviews/reviews.types";

type Props = {
	review: ReviewWithProductType;
	onEdit: (review: ReviewWithProductType) => void;
	onDelete: (reviewId: string) => void;
	deleting?: boolean;
};

function StarRow({ value }: { value: number }) {
	return (
		<div className="flex gap-0.5">
			{[1, 2, 3, 4, 5].map((i) => (
				<Star
					key={i}
					size={12}
					className={
						i <= value
							? "fill-warning text-warning"
							: "fill-default text-default"
					}
				/>
			))}
		</div>
	);
}

export function ReviewCard({ review, onEdit, onDelete, deleting }: Props) {
	const { getPrefetchHandlers } = useQueryIntentPrefetch();
	const productPrefetchHandlers = getPrefetchHandlers(
		getProductBySlugQueryOptions({ slug: review.product.slug }),
	);

	return (
		<div className="border border-border rounded-2xl p-5 space-y-3">
			{/* Product */}
			<div className="flex items-start gap-3">
				{review.product.image && (
					<img
						src={review.product.image}
						alt={review.product.name}
						className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
					/>
				)}
				<div>
					<LinkAnchor
						to="/products/$slug"
						params={{ slug: review.product.slug }}
						className="text-sm font-semibold text-foreground hover:text-accent transition-colors"
						onFocus={productPrefetchHandlers.onFocus}
						onMouseEnter={productPrefetchHandlers.onMouseEnter}
					>
						{review.product.name}
					</LinkAnchor>
					<StarRow value={review.rating} />
				</div>
			</div>

			{/* Content */}
			<div>
				{review.title && (
					<p className="text-sm font-semibold text-foreground">
						{review.title}
					</p>
				)}
				<p className="text-sm text-muted mt-0.5">{review.comment}</p>
			</div>

			<p className="text-xs text-muted">
				{new Date(review.createdAt).toLocaleDateString("en-DE", {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</p>

			{/* Actions */}
			<div className="flex items-center gap-2 pt-1 border-t border-border">
				<Button variant="ghost" size="sm" onPress={() => onEdit(review)}>
					<Edit2 size={12} />
					Edit
				</Button>
				<Button
					variant="ghost"
					size="sm"
					isPending={deleting}
					onPress={() => onDelete(review.id)}
					className="text-danger hover:text-danger ml-auto"
				>
					<Trash2 size={12} />
					Delete
				</Button>
			</div>
		</div>
	);
}
