"use client";

import { Button, Modal } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getFieldError } from "#/components/ui/fields/form-errors";
import { useUpdateReview } from "#/mutations/reviews/use-update-review";
import { createReviewSchema } from "#/server/reviews/reviews.schemas";
import type { ReviewWithProductType } from "#/server/reviews/reviews.types";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	review: ReviewWithProductType | null;
};

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
						size={22}
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

export function EditReviewModal({ isOpen, onClose, review }: Props) {
	const { mutateAsync: updateReview } = useUpdateReview({ onSuccess: onClose });

	const form = useForm({
		defaultValues: {
			rating: review?.rating ?? 0,
			title: review?.title ?? "",
			comment: review?.comment ?? "",
		},
		validators: {
			onSubmit: reviewFormSchema,
		},
		onSubmit: async ({ value }) => {
			if (!review) return;
			await updateReview({
				reviewId: review.id,
				rating: value.rating,
				title: value.title,
				comment: value.comment,
			});
			reset();
		},
	});
	const { handleSubmit, Field, Subscribe, reset, setFieldValue } = form;

	useEffect(() => {
		setFieldValue("rating", review?.rating ?? 0);
		setFieldValue("title", review?.title ?? "");
		setFieldValue("comment", review?.comment ?? "");
	}, [review, setFieldValue]);

	if (!review) return null;

	return (
		<Modal.Root isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog className="max-w-md w-full">
						<Modal.Header>
							<div>
								<Modal.Heading className="text-base font-semibold text-foreground">
									Edit review
								</Modal.Heading>
								<p className="text-sm text-muted mt-0.5">
									{review.product.name}
								</p>
							</div>
							<Modal.CloseTrigger className="text-muted hover:text-foreground" />
						</Modal.Header>

						<Modal.Body>
							<form
								id="edit-review-form"
								onSubmit={(e) => {
									e.preventDefault();
									handleSubmit();
								}}
								className="space-y-4"
							>
								<Field name="rating">
									{(field) => (
										<div>
											<p className="text-xs font-medium text-foreground mb-2">
												Rating
											</p>
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
											<label
												htmlFor="review-title"
												className="block text-xs font-medium text-foreground mb-1"
											>
												Title
											</label>
											<input
												id="review-title"
												type="text"
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												className={`w-full px-3 py-2 text-sm rounded-xl border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 ${
													getFieldError(field, form)
														? "border-danger"
														: "border-border"
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
											<label
												htmlFor="review-comment"
												className="block text-xs font-medium text-foreground mb-1"
											>
												Comment
											</label>
											<textarea
												id="review-comment"
												rows={3}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												className={`w-full px-3 py-2 text-sm rounded-xl border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none ${
													getFieldError(field, form)
														? "border-danger"
														: "border-border"
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
							</form>
						</Modal.Body>

						<Modal.Footer className="gap-2">
							<Button variant="outline" onPress={onClose}>
								Cancel
							</Button>
							<Subscribe>
								{({ isSubmitting, values }) => (
									<Button
										type="submit"
										form="edit-review-form"
										variant="primary"
										isPending={isSubmitting}
										isDisabled={values.rating === 0}
									>
										Save changes
									</Button>
								)}
							</Subscribe>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal.Root>
	);
}
