import { toast } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SocialButton } from "#/components/ui/buttons/social-button";
import { signIn } from "#/lib/auth-client";
import { getSocialAuthProvidersAction } from "#/server/auth/social-auth.action";

type Props = {
	isDisabled?: boolean;
	redirectTo?: string;
};

export function SocialProviders({ isDisabled, redirectTo = "/" }: Props) {
	const [isSigningIn, setIsSigningIn] = useState(false);
	const { data, isLoading } = useQuery({
		queryKey: ["auth", "social-providers"],
		queryFn: () => getSocialAuthProvidersAction({ data: {} }),
		staleTime: 60_000,
	});
	const isGoogleEnabled = data?.googleEnabled === true;
	const isGoogleDisabled = isDisabled || isLoading || !isGoogleEnabled;

	const handleGoogleSignIn = async () => {
		if (isGoogleDisabled) return;

		setIsSigningIn(true);
		const result = await signIn.social({
			provider: "google",
			callbackURL: redirectTo,
		});

		if (result.error) {
			setIsSigningIn(false);
			toast.error(result.error.message ?? "Google sign-in failed");
		}
	};

	return (
		<div className="flex flex-col gap-3">
			<SocialButton
				provider="google"
				isDisabled={isGoogleDisabled}
				isPending={isSigningIn || isLoading}
				onPress={handleGoogleSignIn}
				title={
					isGoogleEnabled
						? "Continue with Google"
						: "Google sign-in is not configured yet"
				}
			/>
		</div>
	);
}
