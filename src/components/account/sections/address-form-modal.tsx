"use client";

import { Button, Modal } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { getFieldError } from "#/components/ui/fields/form-errors";
import { useCreateAddress } from "#/mutations/addresses/use-create-address";
import { useUpdateAddress } from "#/mutations/addresses/use-update-address";
import { createAddressSchema } from "#/server/addresses/addresses.schemas";
import type { AddressType } from "#/server/addresses/addresses.types";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	editAddress?: AddressType | null;
};

const FIELDS: Array<{
	name: string;
	label: string;
	placeholder: string;
	required?: boolean;
}> = [
	{
		name: "fullName",
		label: "Full name",
		placeholder: "John Doe",
		required: true,
	},
	{
		name: "phone",
		label: "Phone",
		placeholder: "+49 123 456789",
		required: true,
	},
	{
		name: "street",
		label: "Street address",
		placeholder: "Musterstraße 1",
		required: true,
	},
	{
		name: "postalCode",
		label: "Postal code",
		placeholder: "10115",
		required: true,
	},
	{ name: "city", label: "City", placeholder: "Berlin", required: true },
	{ name: "state", label: "State / Region", placeholder: "Berlin" },
	{ name: "country", label: "Country", placeholder: "Germany", required: true },
];

export function AddressFormModal({ isOpen, onClose, editAddress }: Props) {
	const { mutateAsync: createAddress } = useCreateAddress({
		onSuccess: onClose,
	});
	const { mutateAsync: updateAddress } = useUpdateAddress({
		onSuccess: onClose,
	});

	const form = useForm({
		defaultValues: {
			fullName: editAddress?.fullName ?? "",
			phone: editAddress?.phone ?? "",
			street: editAddress?.street ?? "",
			postalCode: editAddress?.postalCode ?? "",
			city: editAddress?.city ?? "",
			state: editAddress?.state ?? "",
			country: editAddress?.country ?? "Germany",
		},
		validators: {
			onSubmit: createAddressSchema,
		},
		onSubmit: async ({ value }) => {
			if (editAddress) {
				await updateAddress({
					addressId: editAddress.id,
					fullName: value.fullName,
					phone: value.phone,
					street: value.street,
					postalCode: value.postalCode,
					city: value.city,
					state: value.state || undefined,
					country: value.country,
					isDefault: editAddress.isDefault,
				});
			} else {
				await createAddress({
					fullName: value.fullName,
					phone: value.phone,
					street: value.street,
					postalCode: value.postalCode,
					city: value.city,
					state: value.state || undefined,
					country: value.country,
					isDefault: false,
				});
			}
			reset();
		},
	});
	const { handleSubmit, Field, Subscribe, reset, setFieldValue } = form;

	useEffect(() => {
		setFieldValue("fullName", editAddress?.fullName ?? "");
		setFieldValue("phone", editAddress?.phone ?? "");
		setFieldValue("street", editAddress?.street ?? "");
		setFieldValue("postalCode", editAddress?.postalCode ?? "");
		setFieldValue("city", editAddress?.city ?? "");
		setFieldValue("state", editAddress?.state ?? "");
		setFieldValue("country", editAddress?.country ?? "Germany");
	}, [editAddress, setFieldValue]);

	return (
		<Modal.Root isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog className="max-w-md w-full">
						<Modal.Header>
							<Modal.Heading className="text-base font-semibold text-foreground">
								{editAddress ? "Edit address" : "New address"}
							</Modal.Heading>
							<Modal.CloseTrigger className="text-muted hover:text-foreground" />
						</Modal.Header>

						<Modal.Body>
							<form
								id="address-form"
								onSubmit={(e) => {
									e.preventDefault();
									handleSubmit();
								}}
								className="space-y-3"
							>
								<div className="grid grid-cols-2 gap-3">
									{FIELDS.map((f) => (
										<Field key={f.name} name={f.name as never}>
											{(field) => (
												<div
													className={
														f.name === "street" || f.name === "fullName"
															? "col-span-2"
															: ""
													}
												>
													<label
														htmlFor={f.name}
														className="block text-xs font-medium text-foreground mb-1"
													>
														{f.label}
														{f.required && (
															<span className="text-danger ml-0.5">*</span>
														)}
													</label>
													<input
														id={f.name}
														type="text"
														placeholder={f.placeholder}
														value={(field.state.value as string) ?? ""}
														onChange={(e) =>
															field.handleChange(e.target.value as never)
														}
														onBlur={field.handleBlur}
														required={f.required}
														className={`w-full px-3 py-2 text-sm rounded-xl border bg-surface text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all ${
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
									))}
								</div>
							</form>
						</Modal.Body>

						<Modal.Footer className="gap-2">
							<Button variant="outline" onPress={onClose}>
								Cancel
							</Button>
							<Subscribe>
								{({ isSubmitting }) => (
									<Button
										type="submit"
										form="address-form"
										variant="primary"
										isPending={isSubmitting}
									>
										{editAddress ? "Save changes" : "Add address"}
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
