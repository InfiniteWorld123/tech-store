import {
	FieldError,
	Label,
	TextArea,
	type TextAreaProps,
	TextField,
	type TextFieldProps,
} from "@heroui/react";

type Props = Omit<TextFieldProps, "children" | "className"> & {
	errorText?: string;
	label: string;
	placeholder?: string;
	className?: string;
	textAreaProps?: Omit<TextAreaProps, "placeholder">;
};

export function TextareaField({
	errorText,
	label,
	placeholder,
	className,
	textAreaProps,
	...textFieldProps
}: Props) {
	return (
		<TextField
			isInvalid={Boolean(errorText)}
			className={["flex flex-col gap-1.5", className].filter(Boolean).join(" ")}
			{...textFieldProps}
		>
			<Label>{label}</Label>
			<TextArea
				fullWidth
				placeholder={placeholder}
				variant="secondary"
				{...textAreaProps}
			/>
			{errorText ? <FieldError>{errorText}</FieldError> : null}
		</TextField>
	);
}
