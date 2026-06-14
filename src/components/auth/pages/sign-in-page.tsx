import { Form } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Lock, Mail } from "lucide-react";
import { AuthAlert } from "#/components/auth/sections/auth-alert";
import { AuthCard } from "#/components/auth/sections/auth-card";
import { AuthFooter } from "#/components/auth/sections/auth-footer";
import { AuthHeader } from "#/components/auth/sections/auth-header";
import { DividerWithText } from "#/components/auth/sections/divider-with-text";
import { SocialProviders } from "#/components/auth/sections/social-providers";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { SubmitButton } from "#/components/ui/buttons/submit-button";
import { InputField } from "#/components/ui/fields/input-field";
import { useSignIn } from "#/hooks/use-auth";
import { Route } from "#/routes/_auth/sign-in";
import { SignInSchema } from "#/server/auth/auth.schemas";

const getSafeInternalRedirect = (redirect?: string) => {
	if (!redirect) return undefined;
	if (!redirect.startsWith("/") || redirect.startsWith("//")) return undefined;
	if (redirect.includes("://")) return undefined;
	return redirect;
};

export function SignInPage() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const { signInError, submitSignIn } = useSignIn();
	const safeRedirect = getSafeInternalRedirect(search.redirect);

	const { reset, Field, Subscribe, handleSubmit } = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			const result = await submitSignIn(value);

			if (result.success) {
				reset();
				navigate({
					to: (safeRedirect ?? (result.isAdmin ? "/admin" : "/")) as "/",
				});
			}
		},
		validators: {
			onSubmit: SignInSchema,
			onChange: SignInSchema,
		},
	});

	return (
		<AuthCard>
			<AuthHeader
				title="Welcome back"
				subtitle="Sign in to your account to continue"
			/>

			<SocialProviders redirectTo={safeRedirect ?? "/"} />

			<DividerWithText text="or" />

			<Form
				className="flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<Field name="email">
					{(field) => (
						<InputField
							value={field.state.value}
							onChange={(value) => field.handleChange(value)}
							label="Email"
							type="email"
							placeholder="you@example.com"
							autoComplete="email"
							icon={<Mail size={16} />}
							autoFocus
						/>
					)}
				</Field>

				<Field name="password">
					{(field) => (
						<InputField
							value={field.state.value}
							onChange={(value) => field.handleChange(value)}
							label="Password"
							type="password"
							placeholder="••••••••"
							autoComplete="new-password"
							icon={<Lock size={16} />}
						/>
					)}
				</Field>

				<div className="flex w-full justify-end">
					<LinkAnchor
						to="/forgot-password"
						className="text-sm font-medium text-accent hover:underline"
					>
						Forgot password?
					</LinkAnchor>
				</div>

				<Subscribe>
					{({ isSubmitting }) => (
						<SubmitButton isLoading={isSubmitting} loadingText="Signing in...">
							Sign in
						</SubmitButton>
					)}
				</Subscribe>
			</Form>

			{signInError ? <AuthAlert message={signInError} /> : null}

			<AuthFooter
				prompt="Don't have an account?"
				linkLabel="Sign up"
				linkTo="/sign-up"
			/>
		</AuthCard>
	);
}
