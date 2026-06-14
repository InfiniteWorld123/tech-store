"use client";

import { Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useState } from "react";
import { useDeleteReview } from "#/mutations/reviews/use-delete-review";
import { listMyReviewsQueryOptions } from "#/queries/reviews.queries";
import type { ReviewWithProductType } from "#/server/reviews/reviews.types";
import { EditReviewModal } from "../sections/edit-review-modal";
import { ReviewCard } from "../sections/review-card";

export function ReviewsPage() {
	const { data, isLoading } = useQuery(listMyReviewsQueryOptions());
	const reviews: ReviewWithProductType[] = data?.data?.items ?? [];

	const [editReview, setEditReview] = useState<ReviewWithProductType | null>(
		null,
	);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const { mutate: deleteReview } = useDeleteReview({
		onSuccess: () => setDeletingId(null),
	});

	const handleDelete = (reviewId: string) => {
		setDeletingId(reviewId);
		deleteReview({ reviewId });
	};

	return (
		<div>
			<h1 className="text-2xl font-bold text-foreground mb-6">My Reviews</h1>

			{isLoading ? (
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-32 rounded-2xl" />
					))}
				</div>
			) : reviews.length === 0 ? (
				<div className="border border-dashed border-border rounded-2xl p-12 text-center space-y-3">
					<Star size={28} className="text-muted mx-auto" />
					<p className="text-foreground font-semibold">No reviews yet</p>
					<p className="text-muted text-sm">
						You haven't reviewed any products yet.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{reviews.map((review) => (
						<ReviewCard
							key={review.id}
							review={review}
							onEdit={setEditReview}
							onDelete={handleDelete}
							deleting={deletingId === review.id}
						/>
					))}
				</div>
			)}

			<EditReviewModal
				isOpen={!!editReview}
				onClose={() => setEditReview(null)}
				review={editReview}
			/>
		</div>
	);
}
