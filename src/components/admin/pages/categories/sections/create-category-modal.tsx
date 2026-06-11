import { Button, Form, Modal } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useRef } from "react";
import { InputField } from "#/components/ui/fields/input-field";
import { CategoryIconDisplay } from "#/components/ui/icons/category-icon";
import { CategoryIconPicker } from "#/components/ui/icons/category-icon-picker";
import { useCreateCategory } from "#/mutations/category/use-create-category";
import { Route } from "#/routes/admin/categories";
import { categoryFormSchema } from "../category-form-schema";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

function toSlug(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-");
}

export function CreateCategoryModal({ isOpen, onClose }: Props) {
	const slugEditedRef = useRef(false);

	const { searching } = Route.useSearch();
	const { mutateAsync } = useCreateCategory({ onSuccess: onClose, searching });

	const form = useForm({
		defaultValues: {
			name: "",
			slug: "",
			icon: "",
			iconColor: "#6366f1",
			iconBg: "#eef2ff",
		},
		validators: {
			onSubmit: categoryFormSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await mutateAsync({
					name: value.name.trim(),
					slug: value.slug.trim(),
					icon: value.icon.trim() || null,
					iconColor: value.iconColor || null,
					iconBg: value.iconBg || null,
				});
			} catch {
				// Error already handled by the mutation's onError (toast)
			}
		},
	});

	const { Field, Subscribe, handleSubmit, reset } = form;

	const handleClose = () => {
		reset();
		slugEditedRef.current = false;
		onClose();
	};

	return (
		<Modal.Root isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog>
						<Form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								handleSubmit();
							}}
						>
							<Modal.Header>
								<Modal.Heading className="text-base font-semibold text-foreground">
									New Category
								</Modal.Heading>
								<Modal.CloseTrigger className="text-muted hover:text-foreground">
									<X size={18} />
								</Modal.CloseTrigger>
							</Modal.Header>

							<Modal.Body className="space-y-4">
								{/* Name — auto-fills slug */}
								<Field name="name">
									{(field) => {
										const error = field.state.meta.errors[0]?.message;
										return (
											<InputField
												label="Name"
												placeholder="e.g. Laptops"
												isRequired
												value={field.state.value}
												onChange={(v) => {
													field.handleChange(v);
													if (!slugEditedRef.current) {
														form.setFieldValue("slug", toSlug(v));
													}
												}}
												errorText={
													field.state.meta.isTouched && error
														? error
														: undefined
												}
											/>
										);
									}}
								</Field>

								{/* Slug */}
								<Field name="slug">
									{(field) => {
										const error = field.state.meta.errors[0]?.message;
										return (
											<InputField
												label="Slug"
												placeholder="e.g. laptops"
												description="Auto-generated from name. Lowercase, numbers and hyphens only."
												value={field.state.value}
												onChange={(v) => {
													slugEditedRef.current = true;
													field.handleChange(toSlug(v));
												}}
												errorText={
													field.state.meta.isTouched && error
														? error
														: undefined
												}
											/>
										);
									}}
								</Field>

								{/* Icon picker */}
								<Field name="icon">
									{(field) => (
										<CategoryIconPicker
											value={field.state.value || null}
											onChange={(name) => field.handleChange(name ?? "")}
										/>
									)}
								</Field>

								{/* Colors + preview */}
								<Field name="iconColor">
									{(colorField) => (
										<Field name="iconBg">
											{(bgField) => (
												<div className="flex items-end gap-3">
													{/* Icon color */}
													<div className="flex flex-col gap-1.5 flex-1">
														<span className="text-sm font-medium text-foreground">
															Icon color
														</span>
														<div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 bg-surface">
															<input
																type="color"
																value={colorField.state.value}
																onChange={(e) =>
																	colorField.handleChange(e.target.value)
																}
																className="size-6 rounded cursor-pointer border-0 bg-transparent p-0"
															/>
															<span className="text-sm text-muted font-mono">
																{colorField.state.value}
															</span>
														</div>
													</div>

													{/* Background color */}
													<div className="flex flex-col gap-1.5 flex-1">
														<span className="text-sm font-medium text-foreground">
															Background
														</span>
														<div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 bg-surface">
															<input
																type="color"
																value={bgField.state.value}
																onChange={(e) =>
																	bgField.handleChange(e.target.value)
																}
																className="size-6 rounded cursor-pointer border-0 bg-transparent p-0"
															/>
															<span className="text-sm text-muted font-mono">
																{bgField.state.value}
															</span>
														</div>
													</div>

													{/* Live preview — icon name comes from form state via Subscribe */}
													<div className="flex flex-col gap-1.5">
														<span className="text-sm font-medium text-foreground">
															Preview
														</span>
														<Subscribe>
															{({ values }) => (
																<CategoryIconDisplay
																	icon={values.icon.trim() || null}
																	iconColor={values.iconColor || null}
																	iconBg={values.iconBg || null}
																	name={values.name || "Preview"}
																	iconSize={18}
																	className="size-10"
																/>
															)}
														</Subscribe>
													</div>
												</div>
											)}
										</Field>
									)}
								</Field>
							</Modal.Body>

							<Modal.Footer className="gap-2">
								<Subscribe>
									{({ isSubmitting }) => (
										<>
											<Button
												variant="outline"
												size="sm"
												onPress={handleClose}
												isDisabled={isSubmitting}
											>
												Cancel
											</Button>
											<Button
												type="submit"
												variant="primary"
												size="sm"
												isPending={isSubmitting}
											>
												Create Category
											</Button>
										</>
									)}
								</Subscribe>
							</Modal.Footer>
						</Form>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal.Root>
	);
}
