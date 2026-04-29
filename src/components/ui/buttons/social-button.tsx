import { Button, type ButtonProps } from "@heroui/react";
import { AppleIcon } from "#/components/ui/icons/apple-icon";
import { GoogleIcon } from "#/components/ui/icons/google-icon";

type Provider = "google" | "apple";

type Props = Omit<ButtonProps, "children"> & {
	provider: Provider;
	isLoading?: ButtonProps["isPending"];
};

const LABEL: Record<Provider, string> = {
	google: "Continue with Google",
	apple: "Continue with Apple",
};

function ProviderIcon({ provider }: { provider: Provider }) {
	if (provider === "google") return <GoogleIcon size={18} />;
	return <AppleIcon size={18} />;
}

export function SocialButton({
	provider,
	isLoading,
	isPending,
	type = "button",
	variant = "outline",
	fullWidth = true,
	className,
	...props
}: Props) {
	return (
		<Button
			type={type}
			variant={variant}
			fullWidth={fullWidth}
			isPending={isPending ?? isLoading}
			className={["gap-2", className].filter(Boolean).join(" ")}
			{...props}
		>
			<ProviderIcon provider={provider} />
			<span>{LABEL[provider]}</span>
		</Button>
	);
}
