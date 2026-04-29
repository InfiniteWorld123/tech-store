import { Button, type ButtonProps, Spinner } from "@heroui/react";
import type { ReactNode } from "react";

type Props = ButtonProps & {
	isLoading?: ButtonProps["isPending"];
	loadingText?: ReactNode;
};

export function SubmitButton({
	children,
	isLoading,
	isPending,
	loadingText = "Loading...",
	type = "submit",
	variant = "primary",
	fullWidth = true,
	isDisabled,
	...props
}: Props) {
	const pending = isPending ?? isLoading;

	return (
		<Button
			type={type}
			variant={variant}
			fullWidth={fullWidth}
			isPending={pending}
			isDisabled={isDisabled || pending}
			{...props}
		>
			{pending ? (
				<>
					<Spinner size="sm" color="current" aria-hidden />
					<span>{loadingText}</span>
				</>
			) : (
				children
			)}
		</Button>
	);
}
