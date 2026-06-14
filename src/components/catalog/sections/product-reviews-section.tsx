"use client";

import { Button, Form, Skeleton } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useState } from "react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { getFieldError } from "#/components/ui/fields/form-errors";
import { useSession } from "#/lib/auth-client";
import { useCreateReview } from "#/mutations/reviews/use-create-review";
import { useDeleteReview } from "#/mutations/reviews/use-delete-review";
import { useUpdateReview } from "#/mutations/reviews/use-update-review";
import {
	listReviewsByProductQueryOptions,
	productRatingSummaryQueryOptions,
} from "#/queries/reviews.queries";
import { createReviewSchema } from "#/server/reviews/reviews.schemas";

type Props = { productId: string };

const reviewFormSchema = createReviewSchema.omit({ productId: true });

function StarPicker({
	value,
	onChange,
}: {
	value: number;
	onChange: (v: number) => void;
}) {
	const [hover, setHover] = useState(0);
	return (
		<div className="flex gap-1">
			{[1, 2, 3, 4, 5].map((i) => (
				<button
					key={i}
					type="button"
					onClick={() => onChange(i)}
					onMouseEnter={() => setHover(i)}
					onMouseLeave={() => setHover(0)}
				>
					<Star
						size={20}
						className={
							i <= (hover || value)
								? "fill-warning text-warning"
								: "fill-default text-default"
						}
					/>
				</button>
			))}
		</div>
	);
}

function StarBar({ value }: { value: number }) {
	return (
		<div className="flex gap-0.5">
			{[1, 2, 3, 4, 5].map((i) => (
				<Star
					key={i}
					size={14}
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

function ReviewForm({
	productId,
	onDone,
}: {
	productId: string;
	onDone: () => void;
}) {
	const { mutateAsync, isPending } = useCreateReview({ onSuccess: onDone });

	const form = useForm({
		defaultValues: { rating: 0, title: "", comment: "" },
		validators: {
			onSubmit: reviewFormSchema,
		},
		onSubmit: async ({ value }) => {
			await mutateAsync({
				productId,
				rating: value.rating,
				title: value.title,
				comment: value.comment,
			});
			reset();
		},
	});
	const { handleSubmit, Field, Subscribe, reset } = form;

	return (
		<Form
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			className="space-y-4 bg-surface-secondary rounded-2xl p-4"
		>
			<p className="font-semibold text-foreground">Write a review</p>

			<Field name="rating">
				{(field) => (
					<div>
						<p className="text-sm text-muted mb-1">Your rating</p>
						<StarPicker
							value={field.state.value}
							onChange={(v) => field.handleChange(v)}
						/>
						{getFieldError(field, form) ? (
							<p className="mt-1 text-xs text-danger">
								{getFieldError(field, form)}
							</p>
						) : null}
					</div>
				)}
			</Field>

			<Field name="title">
				{(field) => (
					<div>
						<input
							type="text"
							placeholder="Review title"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							className={`w-full px-3 py-2 text-sm rounded-xl border bg-surface text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/30 ${
								getFieldError(field, form) ? "border-danger" : "border-border"
							}`}
						/>
						{getFieldError(field, form) ? (
							<p className="mt-1 text-xs text-danger">
								{getFieldError(field, form)}
							</p>
						) : null}
					</div>
				)}
			</Field>

			<Field name="comment">
				{(field) => (
					<div>
						<textarea
							placeholder="Share your experience..."
							rows={3}
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							onBlur={field.handleBlur}
							className={`w-full px-3 py-2 text-sm rounded-xl border bg-surface text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none ${
								getFieldError(field, form) ? "border-danger" : "border-border"
							}`}
						/>
						{getFieldError(field, form) ? (
							<p className="mt-1 text-xs text-danger">
								{getFieldError(field, form)}
							</p>
						) : null}
					</div>
				)}
			</Field>

			<Subscribe>
				{({ isSubmitting, values }) => (
					<Button
						type="submit"
						variant="primary"
						size="sm"
						isPending={isSubmitting || isPending}
						isDisabled={values.rating === 0}
					>
						Submit review
					</Button>
				)}
			</Subscribe>
		</Form>
	);
}

export function ProductReviewsSection({ productId }: Props) {
	const { data: sessionData } = useSession();
	const userId = sessionData?.user?.id ?? null;

	const { data: summaryData } = useQuery(
		productRatingSummaryQueryOptions({ productId }),
	);
	const summary = summaryData?.data?.summary;

	const { data: reviewsData, isLoading } = useQuery(
		listReviewsByProductQueryOptions({ productId }),
	);
	const reviews = reviewsData?.data?.items ?? [];

	const myReview = userId ? reviews.find((r) => r.userId === userId) : null;

	const { mutateAsync: updateReview } = useUpdateReview();
	const { mutateAsync: deleteReview } = useDeleteReview();

	const [editingId, setEditingId] = useState<string | null>(null);

	const editForm = useForm({
		defaultValues: {
			rating: myReview?.rating ?? 0,
			title: myReview?.title ?? "",
			comment: myReview?.comment ?? "",
		},
		validators: {
			onSubmit: reviewFormSchema,
		},
		onSubmit: async ({ value }) => {
			if (!myReview) return;
			await updateReview({
				reviewId: myReview.id,
				rating: value.rating,
				title: value.title,
				comment: value.comment,
			});
			setEditingId(null);
		},
	});

	return (
		<div className="space-y-6">
			{/* Rating summary */}
			{summary && (
				<div className="flex items-center gap-6 p-4 bg-surface-secondary rounded-2xl">
					<div className="text-center">
						<p className="text-4xl font-bold text-foreground">
							{summary.averageRating.toFixed(1)}
						</p>
						<StarBar value={summary.averageRating} />
						<p className="text-xs text-muted mt-1">
							{summary.reviewsCount} review
							{summary.reviewsCount !== 1 ? "s" : ""}
						</p>
					</div>
					<div className="flex-1 space-y-1">
						{(
							[
								[5, summary.ratingCounts.five],
								[4, summary.ratingCounts.four],
								[3, summary.ratingCounts.three],
								[2, summary.ratingCounts.two],
								[1, summary.ratingCounts.one],
							] as [number, number][]
						).map(([star, count]) => {
							const pct =
								summary.reviewsCount > 0
									? (count / summary.reviewsCount) * 100
									: 0;
							return (
								<div key={star} className="flex items-center gap-2">
									<span className="text-xs text-muted w-4 text-right">
										{star}
									</span>
									<Star
										size={10}
										className="fill-warning text-warning flex-shrink-0"
									/>
									<div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
										<div
											className="h-full bg-warning rounded-full"
											style={{ width: `${pct}%` }}
										/>
									</div>
									<span className="text-xs text-muted w-4">{count}</span>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Write / edit review */}
			{userId ? (
				myReview && editingId !== myReview.id ? null : !myReview ? (
					<ReviewForm productId={productId} onDone={() => {}} />
				) : null
			) : (
				<div className="bg-surface-secondary rounded-2xl p-4 text-sm text-muted">
					<LinkAnchor
						to="/sign-in"
						className="text-accent font-medium hover:underline"
					>
						Sign in
					</LinkAnchor>{" "}
					to leave a review.
				</div>
			)}

			{/* Review list */}
			{isLoading ? (
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="space-y-2">
							<Skeleton className="h-4 w-32 rounded" />
							<Skeleton className="h-12 w-full rounded" />
						</div>
					))}
				</div>
			) : reviews.length === 0 ? (
				<p className="text-muted text-sm">No reviews yet. Be the first!</p>
			) : (
				<div className="space-y-4">
					{reviews.map((review) => {
						const isOwn = review.userId === userId;
						const isEditing = editingId === review.id;

						return (
							<div
								key={review.id}
								className="border border-border rounded-2xl p-4 space-y-2"
							>
								<div className="flex items-start justify-between gap-2">
									<div>
										<p className="text-sm font-semibold text-foreground">
											{review.customer.name}
										</p>
										<StarBar value={review.rating} />
									</div>
									{isOwn && !isEditing && (
										<div className="flex gap-1">
											<button
												type="button"
												onClick={() => {
													editForm.reset({
														rating: review.rating,
														title: review.title,
														comment: review.comment,
													});
													setEditingId(review.id);
												}}
												className="text-xs text-muted hover:text-foreground px-2 py-1 rounded-lg hover:bg-default transition-colors"
											>
												Edit
											</button>
											<button
												type="button"
												onClick={() => deleteReview({ reviewId: review.id })}
												className="text-xs text-danger hover:text-danger/80 px-2 py-1 rounded-lg hover:bg-danger/10 transition-colors"
											>
												Delete
											</button>
										</div>
									)}
								</div>

								{isEditing ? (
									<Form
										onSubmit={(e) => {
											e.preventDefault();
											editForm.handleSubmit();
										}}
										className="space-y-3 mt-2"
									>
										<editForm.Field name="rating">
											{(field) => (
												<div>
													<StarPicker
														value={field.state.value}
														onChange={(v) => field.handleChange(v)}
													/>
													{getFieldError(field, editForm) ? (
														<p className="mt-1 text-xs text-danger">
															{getFieldError(field, editForm)}
														</p>
													) : null}
												</div>
											)}
										</editForm.Field>
										<editForm.Field name="title">
											{(field) => (
												<div>
													<input
														type="text"
														value={field.state.value}
														onChange={(e) => field.handleChange(e.target.value)}
														onBlur={field.handleBlur}
														className={`w-full px-3 py-2 text-sm rounded-xl border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 ${
															getFieldError(field, editForm)
																? "border-danger"
																: "border-border"
														}`}
													/>
													{getFieldError(field, editForm) ? (
														<p className="mt-1 text-xs text-danger">
															{getFieldError(field, editForm)}
														</p>
													) : null}
												</div>
											)}
										</editForm.Field>
										<editForm.Field name="comment">
											{(field) => (
												<div>
													<textarea
														rows={2}
														value={field.state.value}
														onChange={(e) => field.handleChange(e.target.value)}
														onBlur={field.handleBlur}
														className={`w-full px-3 py-2 text-sm rounded-xl border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none ${
															getFieldError(field, editForm)
																? "border-danger"
																: "border-border"
														}`}
													/>
													{getFieldError(field, editForm) ? (
														<p className="mt-1 text-xs text-danger">
															{getFieldError(field, editForm)}
														</p>
													) : null}
												</div>
											)}
										</editForm.Field>
										<editForm.Subscribe>
											{({ isSubmitting }) => (
												<div className="flex gap-2">
													<Button
														type="submit"
														variant="primary"
														size="sm"
														isPending={isSubmitting}
													>
														Save
													</Button>
													<Button
														type="button"
														variant="outline"
														size="sm"
														onPress={() => setEditingId(null)}
													>
														Cancel
													</Button>
												</div>
											)}
										</editForm.Subscribe>
									</Form>
								) : (
									<>
										<p className="font-medium text-sm text-foreground">
											{review.title}
										</p>
										<p className="text-sm text-muted">{review.comment}</p>
									</>
								)}

								<p className="text-xs text-muted">
									{new Date(review.createdAt).toLocaleDateString("en-DE", {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</p>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
