import { Button, Form, Modal } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { z } from "zod";
import { getAdminFieldError } from "#/components/admin/ui/admin-form-errors";
import { InputField } from "#/components/ui/fields/input-field";
import { useCreateShipping } from "#/mutations/shipping/use-create-shipping";
import type { ShippingCarrier, ShippingMethod } from "../shipping.types";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

const carrierOptions = [
	{ value: "dhl", label: "DHL" },
	{ value: "hermes", label: "Hermes" },
	{ value: "ups", label: "UPS" },
	{ value: "fedex", label: "FedEx" },
] as const;

const methodOptions = [
	{ value: "standard", label: "Standard" },
	{ value: "express", label: "Express" },
	{ value: "same_day", label: "Same Day" },
] as const;

const createShipmentSchema = z.object({
	orderId: z.uuid("Order id must be a valid UUID"),
	carrier: z.enum(["dhl", "hermes", "ups", "fedex"]),
	method: z.enum(["standard", "express", "same_day"]),
});

export function CreateShipmentModal({ isOpen, onClose }: Props) {
	const createShipping = useCreateShipping();
	const form = useForm({
		defaultValues: {
			orderId: "",
			carrier: "dhl" as ShippingCarrier,
			method: "standard" as ShippingMethod,
		},
		validators: {
			onSubmit: createShipmentSchema,
		},
		onSubmit: async ({ value }) => {
			await createShipping.mutateAsync({
				orderId: value.orderId,
				carrier: value.carrier,
				method: value.method,
			});
			onClose();
		},
	});
	const { Field, Subscribe, handleSubmit, reset } = form;

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
							onSubmit={(event) => {
								event.preventDefault();
								event.stopPropagation();
								handleSubmit();
							}}
						>
							<Modal.Header>
								<Modal.Heading className="text-base font-semibold text-foreground">
									New Shipment
								</Modal.Heading>
								<Modal.CloseTrigger className="text-muted hover:text-foreground">
									<X size={18} />
								</Modal.CloseTrigger>
							</Modal.Header>

							<Modal.Body className="space-y-4">
								<Field name="orderId">
									{(field) => (
										<InputField
											label="Order ID"
											placeholder="e.g. 018e1234-abcd-4567-89ab-0123456789ab"
											value={field.state.value}
											onChange={(value) => field.handleChange(value)}
											onBlur={field.handleBlur}
											errorText={getAdminFieldError(field, form)}
										/>
									)}
								</Field>

								<Field name="carrier">
									{(field) => (
										<SelectField
											label="Carrier"
											value={field.state.value}
											onChange={(value) =>
												field.handleChange(value as ShippingCarrier)
											}
											errorText={getAdminFieldError(field, form)}
										>
											{carrierOptions.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</SelectField>
									)}
								</Field>

								<Field name="method">
									{(field) => (
										<SelectField
											label="Method"
											value={field.state.value}
											onChange={(value) =>
												field.handleChange(value as ShippingMethod)
											}
											errorText={getAdminFieldError(field, form)}
										>
											{methodOptions.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</SelectField>
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
												isDisabled={isSubmitting}
											>
												Create Shipment
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

function SelectField({
	label,
	value,
	onChange,
	children,
	errorText,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	children: ReactNode;
	errorText?: string;
}) {
	return (
		<label className="flex flex-col gap-1.5">
			<span className="text-sm font-medium text-foreground">{label}</span>
			<select
				value={value}
				onChange={(event) => onChange(event.target.value)}
				className="w-full cursor-pointer appearance-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
			>
				{children}
			</select>
			{errorText ? (
				<span className="text-xs text-danger">{errorText}</span>
			) : null}
		</label>
	);
}
