import { Package } from "lucide-react";
import { useState } from "react";
import {
	AdminDetailSheet,
	DetailRow,
	DetailSection,
} from "#/components/admin/ui/admin-detail-sheet";
import { DataError } from "#/components/ui/states/data-error";
import { DataLoading } from "#/components/ui/states/data-loading";
import {
	usePersistedViewMode,
	ViewModeToggle,
} from "#/components/ui/view-mode-toggle";
import type { ReviewListItem } from "../reviews.types";
import { useReviewsPanel } from "../use-reviews-panel";
import { ReviewsFilters } from "./reviews-filters";
import { ReviewsPagination } from "./reviews-pagination";
import { StarRating } from "./star-rating";

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
		<div className="flex min-w-0 items-center gap-2">
			<div className="size-9 rounded-xl bg-default flex items-center justify-center shrink-0 border border-border">
				<Package size={16} className="text-muted" />
			</div>
			<span className="min-w-0 break-words text-xs text-muted">{name}</span>
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

function TableView({
	items,
	onView,
}: {
	items: ReviewListItem[];
	onView: (item: ReviewListItem) => void;
}) {
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
							onClick={() => onView(r)}
							className="cursor-pointer border-b border-border last:border-0 hover:bg-default/50 transition-colors"
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

function ListView({
	items,
	onView,
}: {
	items: ReviewListItem[];
	onView: (item: ReviewListItem) => void;
}) {
	if (items.length === 0) return <EmptyState />;

	return (
		<div className="divide-y divide-border">
			{items.map((r) => (
				<button
					key={r.id}
					type="button"
					onClick={() => onView(r)}
					className="flex w-full items-start gap-4 py-4 text-left"
				>
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
				</button>
			))}
		</div>
	);
}

function CardsView({
	items,
	onView,
}: {
	items: ReviewListItem[];
	onView: (item: ReviewListItem) => void;
}) {
	if (items.length === 0) return <EmptyState />;

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
			{items.map((r) => (
				<button
					key={r.id}
					type="button"
					onClick={() => onView(r)}
					className="bg-default/40 border border-border rounded-2xl p-4 space-y-3 text-left"
				>
					<div className="flex min-w-0 items-center justify-between gap-2">
						<div className="flex min-w-0 items-center gap-3">
							<Avatar name={r.customer.name} />
							<div className="min-w-0">
								<p className="break-words text-sm font-semibold text-foreground">
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
					<p className="break-words text-sm font-semibold text-foreground">
						{r.title}
					</p>
					<p className="text-xs text-muted line-clamp-3">{r.comment}</p>
				</button>
			))}
		</div>
	);
}

export function AllReviewsPanel() {
	const [viewMode, setViewMode] = usePersistedViewMode(
		"admin:reviews:view-mode",
	);
	const [detailTarget, setDetailTarget] = useState<ReviewListItem | null>(null);
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
			<div className="flex flex-col gap-3 min-[520px]:flex-row min-[520px]:items-center min-[520px]:justify-between">
				<ReviewsFilters
					search={inputValue}
					rating={rating}
					onSearchChange={setInputValue}
					onRatingChange={setRating}
					onPrefetchRating={prefetchRating}
				/>
				<ViewModeToggle value={viewMode} onChange={setViewMode} />
			</div>

			{/* Content */}
			<div
				className={
					isStale
						? "opacity-50 transition-opacity"
						: "opacity-100 transition-opacity"
				}
			>
				<div className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
					{isError ? (
						<DataError title="Failed to load reviews" />
					) : isLoading ? (
						<DataLoading label="Loading reviews..." />
					) : (
						<>
							{viewMode === "table" && (
								<TableView items={items} onView={setDetailTarget} />
							)}
							{viewMode === "list" && (
								<ListView items={items} onView={setDetailTarget} />
							)}
							{viewMode === "cards" && (
								<CardsView items={items} onView={setDetailTarget} />
							)}
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
			<ReviewDetailSheet
				review={detailTarget}
				onClose={() => setDetailTarget(null)}
			/>
		</div>
	);
}

function ReviewDetailSheet({
	review,
	onClose,
}: {
	review: ReviewListItem | null;
	onClose: () => void;
}) {
	return (
		<AdminDetailSheet
			isOpen={review !== null}
			onClose={onClose}
			title={review?.title ?? "Review"}
			subtitle={
				review ? `${review.customer.name} on ${review.product.name}` : undefined
			}
			badge={review ? <StarRating rating={review.rating} /> : null}
		>
			{review ? (
				<div className="space-y-5">
					<DetailSection title="Review">
						<DetailRow label="ID" value={review.id} mono />
						<DetailRow
							label="Rating"
							value={<StarRating rating={review.rating} />}
						/>
						<DetailRow label="Title" value={review.title} />
						<DetailRow
							label="Comment"
							value={<p className="whitespace-pre-wrap">{review.comment}</p>}
						/>
					</DetailSection>
					<DetailSection title="Customer">
						<DetailRow label="Customer ID" value={review.customer.id} mono />
						<DetailRow label="Name" value={review.customer.name} />
					</DetailSection>
					<DetailSection title="Product">
						<DetailRow label="Product ID" value={review.product.id} mono />
						<DetailRow label="Name" value={review.product.name} />
						<DetailRow label="Slug" value={review.product.slug} mono />
					</DetailSection>
					<DetailSection title="Timestamps">
						<DetailRow
							label="Created"
							value={new Date(review.createdAt).toLocaleString()}
						/>
						<DetailRow
							label="Updated"
							value={new Date(review.updatedAt).toLocaleString()}
						/>
					</DetailSection>
				</div>
			) : null}
		</AdminDetailSheet>
	);
}
