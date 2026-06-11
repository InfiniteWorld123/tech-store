"use client";

import type { ColorValue as Color } from "@heroui/react";
import {
	Button,
	ColorArea,
	ColorPicker,
	ColorSlider,
	ColorSwatch,
	Form,
	Label,
	Modal,
	NumberField,
	toast,
} from "@heroui/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { InputField } from "#/components/ui/fields/input-field";
import type { OptionConfig, OptionRow } from "../option-configs";

type Props = {
	config: OptionConfig;
	isOpen: boolean;
	onClose: () => void;
	/** When provided the form is in edit mode and prefilled from this row. */
	row?: OptionRow | null;
};

export function OptionFormModal({ config, isOpen, onClose, row }: Props) {
	const isEdit = Boolean(row);
	const { valueField } = config;
	const isHex = valueField.kind === "hex";

	const [name, setName] = useState("");
	// null until the browser parses the color (avoids SSR parseColor failure)
	const [color, setColor] = useState<Color | null>(null);
	const [num, setNum] = useState<number | null>(null);

	// Prefill (or reset) whenever the modal is opened for a new target.
	useEffect(() => {
		if (!isOpen) return;
		setName(row?.name ?? "");
		if (isHex) {
			const initialHex =
				typeof row?.value === "string" && row.value ? row.value : "#000000";
			import("@heroui/react").then(({ parseColor }) => {
				try {
					setColor(parseColor(initialHex));
				} catch {
					setColor(parseColor("#000000"));
				}
			});
		} else {
			setNum(typeof row?.value === "number" ? row.value : null);
		}
	}, [isOpen, row, isHex]);

	const hexString = color ? color.toString("hex") : "#000000";

	const handleSubmit = () => {
		// UI-only scaffold — no API call yet. Wire to the create/update action
		// during the API-connection pass.
		toast.success(
			`${isEdit ? "Updated" : "Created"} ${config.singular} "${name.trim()}" (UI only — not saved)`,
		);
		onClose();
	};

	return (
		<Modal.Root isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
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
								<InputField
									label="Name"
									placeholder={`e.g. Midnight Black`}
									isRequired
									value={name}
									onChange={setName}
								/>

								{isHex ? (
									<div className="flex flex-col gap-1.5">
										<Label className="text-sm font-medium text-foreground">
											{valueField.label}
										</Label>
										<ColorPicker.Root
											value={color ?? undefined}
											onChange={setColor}
										>
											<ColorPicker.Trigger aria-label="Pick a color">
												<div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 bg-surface cursor-pointer hover:bg-default/50 transition-colors">
													<ColorSwatch.Root
														color={hexString}
														size="sm"
														aria-hidden
														className="rounded-md ring-1 ring-border shrink-0"
													/>
													<code className="text-sm font-mono text-foreground">
														{hexString}
													</code>
												</div>
											</ColorPicker.Trigger>
											<ColorPicker.Popover placement="bottom start">
												<div className="flex flex-col gap-3 p-3 w-56">
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
													<div className="flex items-center gap-2 px-2 py-1.5 bg-default rounded-lg">
														<ColorSwatch.Root
															color={hexString}
															size="sm"
															aria-hidden
															className="rounded-md ring-1 ring-border shrink-0"
														/>
														<code className="text-xs font-mono text-muted">
															{hexString}
														</code>
													</div>
												</div>
											</ColorPicker.Popover>
										</ColorPicker.Root>
									</div>
								) : (
									<NumberField.Root
										value={num ?? Number.NaN}
										onChange={(v) => setNum(Number.isNaN(v) ? null : v)}
										minValue={valueField.min}
										step={valueField.step}
										className="flex flex-col gap-1.5"
									>
										<Label>
											{valueField.label}
											{valueField.unit ? ` (${valueField.unit})` : ""}
										</Label>
										<NumberField.Group>
											<NumberField.DecrementButton />
											<NumberField.Input placeholder={valueField.placeholder} />
											<NumberField.IncrementButton />
										</NumberField.Group>
									</NumberField.Root>
								)}
							</Modal.Body>

							<Modal.Footer className="gap-2">
								<Button variant="outline" size="sm" onPress={onClose}>
									Cancel
								</Button>
								<Button type="submit" variant="primary" size="sm">
									{isEdit ? "Save changes" : `Create ${config.singular}`}
								</Button>
							</Modal.Footer>
						</Form>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal.Root>
	);
}
