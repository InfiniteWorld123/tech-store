"use client";

import type { ColorValue as Color } from "@heroui/react";
import {
	Button,
	ColorArea,
	ColorPicker,
	ColorSlider,
	ColorSwatch,
	Form,
	Modal,
} from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { getAdminFieldError } from "#/components/admin/ui/admin-form-errors";
import { InputField } from "#/components/ui/fields/input-field";
import { useCreateColor } from "#/mutations/options/use-create-color";
import { useCreateRam } from "#/mutations/options/use-create-ram";
import { useCreateScreen } from "#/mutations/options/use-create-screen";
import { useCreateStorage } from "#/mutations/options/use-create-storage";
import { useUpdateColor } from "#/mutations/options/use-update-color";
import { useUpdateRam } from "#/mutations/options/use-update-ram";
import { useUpdateScreen } from "#/mutations/options/use-update-screen";
import { useUpdateStorage } from "#/mutations/options/use-update-storage";
import type { OptionConfig, OptionRow } from "../option-configs";

type Props = {
	config: OptionConfig;
	isOpen: boolean;
	onClose: () => void;
	/** When provided the form is in edit mode and prefilled from this row. */
	row?: OptionRow | null;
};

type OptionFormValues = {
	name: string;
	value: string;
};

function optionFormSchema(config: OptionConfig) {
	return z
		.object({
			name: z.string().trim().min(2, "Name must be at least 2 characters"),
			value: z.string().trim(),
		})
		.superRefine((value, context) => {
			const rawValue = value.value.trim();

			if (config.valueField.kind === "hex") {
				if (rawValue && !/^#[0-9a-f]{6}$/i.test(rawValue)) {
					context.addIssue({
						code: "custom",
						message: "Hex must look like #000000",
						path: ["value"],
					});
				}
				return;
			}

			if (!rawValue) {
				context.addIssue({
					code: "custom",
					message: `${config.valueField.label} is required`,
					path: ["value"],
				});
				return;
			}

			const numericValue = Number(rawValue);
			if (!Number.isFinite(numericValue)) {
				context.addIssue({
					code: "custom",
					message: `${config.valueField.label} must be a number`,
					path: ["value"],
				});
				return;
			}

			if (config.valueField.kind === "int" && !Number.isInteger(numericValue)) {
				context.addIssue({
					code: "custom",
					message: `${config.valueField.label} must be a whole number`,
					path: ["value"],
				});
			}

			if (
				config.valueField.min !== undefined &&
				numericValue < config.valueField.min
			) {
				context.addIssue({
					code: "custom",
					message: `${config.valueField.label} must be at least ${config.valueField.min}`,
					path: ["value"],
				});
			}
		});
}

export function OptionFormModal({ config, isOpen, onClose, row }: Props) {
	const isEdit = Boolean(row);
	const { valueField } = config;
	const isHex = valueField.kind === "hex";

	// null until the browser parses the color (avoids SSR parseColor failure)
	const [color, setColor] = useState<Color | null>(null);
	const createColor = useCreateColor();
	const updateColor = useUpdateColor();
	const createStorage = useCreateStorage();
	const updateStorage = useUpdateStorage();
	const createRam = useCreateRam();
	const updateRam = useUpdateRam();
	const createScreen = useCreateScreen();
	const updateScreen = useUpdateScreen();

	const form = useForm({
		defaultValues: {
			name: "",
			value: "",
		} satisfies OptionFormValues,
		validators: {
			onSubmit: optionFormSchema(config),
		},
		onSubmit: async ({ value }) => {
			const name = value.name.trim();
			const rawValue = value.value.trim();
			const numericValue = Number(rawValue);

			if (config.key === "colors") {
				if (isEdit && row) {
					await updateColor.mutateAsync({
						colorId: row.id,
						name,
						hexCode: rawValue || null,
					});
				} else {
					await createColor.mutateAsync({ name, hexCode: rawValue || null });
				}
			}

			if (config.key === "storages") {
				if (isEdit && row) {
					await updateStorage.mutateAsync({
						storageId: row.id,
						name,
						valueGb: numericValue,
					});
				} else {
					await createStorage.mutateAsync({ name, valueGb: numericValue });
				}
			}

			if (config.key === "rams") {
				if (isEdit && row) {
					await updateRam.mutateAsync({
						ramId: row.id,
						name,
						valueGb: numericValue,
					});
				} else {
					await createRam.mutateAsync({ name, valueGb: numericValue });
				}
			}

			if (config.key === "screens") {
				if (isEdit && row) {
					await updateScreen.mutateAsync({
						screenId: row.id,
						name,
						valueInches: numericValue,
					});
				} else {
					await createScreen.mutateAsync({ name, valueInches: numericValue });
				}
			}

			onClose();
		},
	});
	const { Field, Subscribe, handleSubmit, reset, setFieldValue } = form;

	// Prefill (or reset) whenever the modal is opened for a new target.
	useEffect(() => {
		if (!isOpen) {
			reset();
			return;
		}
		const nextValue =
			row?.value === null || row?.value === undefined ? "" : String(row.value);
		setFieldValue("name", row?.name ?? "");
		setFieldValue("value", nextValue);
		if (isHex) {
			const initialHex = nextValue || "#000000";
			import("@heroui/react").then(({ parseColor }) => {
				try {
					setColor(parseColor(initialHex));
				} catch {
					setColor(parseColor("#000000"));
				}
			});
		}
	}, [isOpen, row, isHex, reset, setFieldValue]);

	const hexString = color ? color.toString("hex") : "#000000";

	function handleClose() {
		reset();
		onClose();
	}

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
									{isEdit ? "Edit" : "New"} {config.singular}
								</Modal.Heading>
								<Modal.CloseTrigger className="text-muted hover:text-foreground">
									<X size={18} />
								</Modal.CloseTrigger>
							</Modal.Header>

							<Modal.Body className="space-y-4">
								<Field name="name">
									{(field) => (
										<InputField
											label="Name"
											placeholder="e.g. Midnight Black"
											isRequired
											value={field.state.value}
											onChange={(value) => field.handleChange(value)}
											onBlur={field.handleBlur}
											errorText={getAdminFieldError(field, form)}
										/>
									)}
								</Field>

								<Field name="value">
									{(field) =>
										isHex ? (
											<div className="flex flex-col gap-2">
												<InputField
													label={valueField.label}
													placeholder={valueField.placeholder}
													value={field.state.value}
													onChange={(value) => {
														field.handleChange(value);
														import("@heroui/react").then(({ parseColor }) => {
															try {
																setColor(parseColor(value || "#000000"));
															} catch {
																// Keep the typed value visible; validation handles bad hex.
															}
														});
													}}
													onBlur={field.handleBlur}
													errorText={getAdminFieldError(field, form)}
												/>
												<ColorPicker.Root
													value={color ?? undefined}
													onChange={(nextColor) => {
														setColor(nextColor);
														field.handleChange(nextColor.toString("hex"));
													}}
												>
													<ColorPicker.Trigger aria-label="Pick a color">
														<div className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 transition-colors hover:bg-default/50">
															<ColorSwatch.Root
																color={hexString}
																size="sm"
																aria-hidden
																className="shrink-0 rounded-md ring-1 ring-border"
															/>
															<code className="font-mono text-sm text-foreground">
																{hexString}
															</code>
														</div>
													</ColorPicker.Trigger>
													<ColorPicker.Popover placement="bottom start">
														<div className="flex w-56 flex-col gap-3 p-3">
															<ColorArea.Root
																colorSpace="hsb"
																xChannel="saturation"
																yChannel="brightness"
																className="w-full rounded-lg"
															>
																<ColorArea.Thumb />
															</ColorArea.Root>
															<ColorSlider.Root channel="hue" colorSpace="hsb">
																<ColorSlider.Track>
																	<ColorSlider.Thumb />
																</ColorSlider.Track>
															</ColorSlider.Root>
															<div className="flex items-center gap-2 rounded-lg bg-default px-2 py-1.5">
																<ColorSwatch.Root
																	color={hexString}
																	size="sm"
																	aria-hidden
																	className="shrink-0 rounded-md ring-1 ring-border"
																/>
																<code className="font-mono text-xs text-muted">
																	{hexString}
																</code>
															</div>
														</div>
													</ColorPicker.Popover>
												</ColorPicker.Root>
											</div>
										) : (
											<InputField
												label={`${valueField.label}${valueField.unit ? ` (${valueField.unit})` : ""}`}
												placeholder={valueField.placeholder}
												value={field.state.value}
												onChange={(value) =>
													field.handleChange(
														valueField.kind === "int"
															? value.replace(/[^0-9]/g, "")
															: value.replace(/[^0-9.]/g, ""),
													)
												}
												onBlur={field.handleBlur}
												errorText={getAdminFieldError(field, form)}
											/>
										)
									}
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
												isDisabled={isSubmitting}
											>
												{isEdit ? "Save changes" : `Create ${config.singular}`}
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
