import {
	Button,
	FieldError,
	InputGroup,
	type InputGroupInputProps,
	Label,
	TextField,
	type TextFieldProps,
} from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { type ReactNode, useState } from "react";

type Props = Omit<TextFieldProps, "children" | "className" | "type"> & {
	errorText?: string;
	label: string;
	placeholder?: string;
	description?: string;
	type?: "text" | "email" | "password";
	icon?: ReactNode;
	className?: string;
	inputProps?: Omit<InputGroupInputProps, "autoFocus" | "placeholder">;
};

export function InputField({
	errorText,
	label,
	placeholder,
	description,
	autoFocus,
	type = "text",
	icon,
	className,
	inputProps,
	...textFieldProps
}: Props) {
	const [isVisible, setIsVisible] = useState(false);
	const isPassword = type === "password";
	const resolvedType = isPassword && isVisible ? "text" : type;

	return (
		<TextField
			type={resolvedType}
			isInvalid={Boolean(errorText)}
			className={["flex flex-col gap-1.5", className].filter(Boolean).join(" ")}
			{...textFieldProps}
		>
			<Label>{label}</Label>
			<InputGroup variant="primary">
				{icon ? <InputGroup.Prefix>{icon}</InputGroup.Prefix> : null}
				<InputGroup.Input
					placeholder={placeholder}
					autoFocus={autoFocus}
					{...inputProps}
				/>
				{isPassword ? (
					<InputGroup.Suffix>
						<Button
							type="button"
							onPress={() => setIsVisible((v) => !v)}
							aria-label={isVisible ? "Hide password" : "Show password"}
							isIconOnly
							size="sm"
							variant="ghost"
							className="size-7 text-muted hover:text-foreground"
						>
							{isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
						</Button>
					</InputGroup.Suffix>
				) : null}
			</InputGroup>
			{description && !errorText ? (
				<p className="text-xs text-muted">{description}</p>
			) : null}
			{errorText ? <FieldError>{errorText}</FieldError> : null}
		</TextField>
	);
}
