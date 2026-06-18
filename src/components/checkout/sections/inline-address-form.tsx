"use client";

import { Button } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { getFieldError } from "#/components/ui/fields/form-errors";
import { useCreateAddress } from "#/mutations/addresses/use-create-address";
import { createAddressSchema } from "#/server/addresses/addresses.schemas";
import type { AddressType } from "#/server/addresses/addresses.types";

type Props = {
	isDefault?: boolean;
	onSuccess: (address: AddressType) => void;
};

type Field = {
	name: string;
	label: string;
	placeholder: string;
	required?: boolean;
	type?: string;
};

const FIELDS: Field[] = [
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

export function InlineAddressForm({ isDefault = false, onSuccess }: Props) {
	const { mutateAsync, isPending } = useCreateAddress({ onSuccess });

	const form = useForm({
		defaultValues: {
			fullName: "",
			phone: "",
			street: "",
			postalCode: "",
			city: "",
			state: "",
			country: "Germany",
		},
		validators: {
			onSubmit: createAddressSchema,
		},
		onSubmit: async ({ value }) => {
			await mutateAsync({
				fullName: value.fullName,
				phone: value.phone,
				street: value.street,
				postalCode: value.postalCode,
				city: value.city,
				state: value.state || undefined,
				country: value.country,
				isDefault,
			});
		},
	});
	const { handleSubmit, Field, Subscribe } = form;

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{FIELDS.map((f) => (
					<Field key={f.name} name={f.name as never}>
						{(field) => (
							<div className={f.name === "street" ? "sm:col-span-2" : ""}>
								<label
									htmlFor={f.name}
									className="block text-xs font-medium text-foreground mb-1"
								>
									{f.label}
									{f.required && <span className="text-danger ml-0.5">*</span>}
								</label>
								<input
									id={f.name}
									type={f.type ?? "text"}
									placeholder={f.placeholder}
									value={(field.state.value as string) ?? ""}
									onChange={(e) => field.handleChange(e.target.value as never)}
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

			<Subscribe>
				{({ isSubmitting }) => (
					<Button
						type="button"
						variant="primary"
						isPending={isSubmitting || isPending}
						onPress={() => handleSubmit()}
						className="w-full sm:w-auto"
					>
						Save address
					</Button>
				)}
			</Subscribe>
		</div>
	);
}
