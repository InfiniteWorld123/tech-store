import { SocialButton } from "#/components/ui/buttons/social-button";

type Props = {
	isDisabled?: boolean;
};

export function SocialProviders({ isDisabled }: Props) {
	return (
		<div className="flex flex-col gap-3">
			<SocialButton provider="google" isDisabled={isDisabled} />
			<SocialButton provider="apple" isDisabled={isDisabled} />
		</div>
	);
}
