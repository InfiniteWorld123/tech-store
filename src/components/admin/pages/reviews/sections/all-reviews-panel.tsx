import { Package } from "lucide-react";
import { useState } from "react";
import { useReviewsPanel } from "#/hooks/use-reviews-panel";
import type { ReviewWithCustomerAndProductType } from "#/server/reviews/reviews.types";
import { ReviewsFilters } from "./reviews-filters";
import { ReviewsPagination } from "./reviews-pagination";
import { StarRating } from "./star-rating";
import { type ViewMode, ViewToggle } from "./view-toggle";

function Avatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
	return (
		<div className="size-9 rounded-full bg-accent flex items-center justify-center shrink-0">
			<span className="text-xs font-bold text-white">{initials}</span>
		</div>
	);
}

function ProductBadge({ name }: { name: string }) {
	return (
		<div className="flex items-center gap-2">
			<div className="size-9 rounded-xl bg-default flex items-center justify-center shrink-0 border border-border">
				<Package size={16} className="text-muted" />
			</div>
			<span className="text-xs text-muted whitespace-nowrap">{name}</span>
		</div>
	);
}

function EmptyState() {
	return (
		<div className="py-12 text-center">
			<p className="text-sm text-muted">No reviews found.</p>
		</div>
	);
}

function TableView({ items }: { items: ReviewWithCustomerAndProductType[] }) {
	if (items.length === 0) return <EmptyState />;

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-border">
						<th className="text-left py-3 px-2 text-xs font-semibold text-muted">
							Customer
						</th>
						<th className="text-left py-3 px-2 text-xs font-semibold text-muted">
							Product
						</th>
						<th className="text-left py-3 px-2 text-xs font-semibold text-muted">
							Rating
						</th>
						<th className="text-left py-3 px-2 text-xs font-semibold text-muted">
							Title
						</th>
						<th className="text-left py-3 px-2 text-xs font-semibold text-muted">
							Comment
						</th>
						<th className="text-left py-3 px-2 text-xs font-semibold text-muted">
							Date
						</th>
					</tr>
				</thead>
				<tbody>
					{items.map((r) => (
						<tr
							key={r.id}
							className="border-b border-border last:border-0 hover:bg-default/50 transition-colors"
						>
							<td className="py-3 px-2">
								<div className="flex items-center gap-2">
									<Avatar name={r.customer.name} />
									<span className="font-medium text-foreground whitespace-nowrap">
										{r.customer.name}
									</span>
								</div>
							</td>
							<td className="py-3 px-2">
								<ProductBadge name={r.product.name} />
							</td>
							<td className="py-3 px-2">
								<StarRating rating={r.rating} />
							</td>
							<td className="py-3 px-2 font-medium text-foreground">
								{r.title}
							</td>
							<td className="py-3 px-2 text-muted max-w-xs truncate">
								{r.comment}
							</td>
							<td className="py-3 px-2 text-muted whitespace-nowrap">
								{new Date(r.createdAt).toLocaleDateString()}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function ListView({ items }: { items: ReviewWithCustomerAndProductType[] }) {
	if (items.length === 0) return <EmptyState />;

	return (
		<div className="divide-y divide-border">
			{items.map((r) => (
				<div key={r.id} className="flex items-start gap-4 py-4">
					<Avatar name={r.customer.name} />
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between gap-2 flex-wrap">
							<div className="flex items-center gap-2 flex-wrap">
								<span className="font-semibold text-foreground text-sm">
									{r.customer.name}
								</span>
								<span className="text-xs text-muted">on</span>
								<span className="text-xs font-medium text-muted">
									{r.product.name}
								</span>
							</div>
							<span className="text-xs text-muted whitespace-nowrap">
								{new Date(r.createdAt).toLocaleDateString()}
							</span>
						</div>
						<div className="flex items-center gap-2 mt-1">
							<StarRating rating={r.rating} />
							<span className="text-xs font-semibold text-foreground">
								{r.title}
							</span>
						</div>
						<p className="text-sm text-muted mt-1 line-clamp-2">{r.comment}</p>
					</div>
				</div>
			))}
		</div>
	);
}

function CardsView({ items }: { items: ReviewWithCustomerAndProductType[] }) {
	if (items.length === 0) return <EmptyState />;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{items.map((r) => (
				<div
					key={r.id}
					className="bg-default/40 border border-border rounded-2xl p-4 space-y-3"
				>
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-3">
							<Avatar name={r.customer.name} />
							<div>
								<p className="text-sm font-semibold text-foreground">
									{r.customer.name}
								</p>
								<p className="text-xs text-muted">
									{new Date(r.createdAt).toLocaleDateString()}
								</p>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2 text-xs text-muted">
						<Package size={13} />
						<span className="truncate">{r.product.name}</span>
					</div>
					<StarRating rating={r.rating} />
					<p className="text-sm font-semibold text-foreground">{r.title}</p>
					<p className="text-xs text-muted line-clamp-3">{r.comment}</p>
				</div>
			))}
		</div>
	);
}

export function AllReviewsPanel() {
	const [viewMode, setViewMode] = useState<ViewMode>("table");
	const {
		inputValue,
		setInputValue,
		rating,
		setRating,
		page,
		limit,
		setPage,
		data,
		isLoading,
		isError,
		isStale,
		prefetchPage,
		prefetchRating,
	} = useReviewsPanel();

	const items = data?.data.items ?? [];
	const pagination = data?.data.pagination;

	return (
		<div className="space-y-4">
			{/* Toolbar */}
			<div className="flex items-center justify-between gap-3">
				<ReviewsFilters
					search={inputValue}
					rating={rating}
					onSearchChange={setInputValue}
					onRatingChange={setRating}
					onPrefetchRating={prefetchRating}
				/>
				<ViewToggle value={viewMode} onChange={setViewMode} />
			</div>

			{/* Content */}
			<div
				className={
					isStale
						? "opacity-50 transition-opacity"
						: "opacity-100 transition-opacity"
				}
			>
				<div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
					{isError ? (
						<p className="text-sm text-danger py-8 text-center">
							Failed to load reviews
						</p>
					) : isLoading ? (
						<p className="text-sm text-muted py-8 text-center">
							Loading reviews...
						</p>
					) : (
						<>
							{viewMode === "table" && <TableView items={items} />}
							{viewMode === "list" && <ListView items={items} />}
							{viewMode === "cards" && <CardsView items={items} />}
						</>
					)}

					{pagination && (
						<ReviewsPagination
							onPrefetchPage={prefetchPage}
							currentPage={page}
							totalPages={pagination.totalPages}
							totalItems={pagination.total}
							limit={limit}
							onPageChange={setPage}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
