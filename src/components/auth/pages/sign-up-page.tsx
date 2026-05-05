import { Form } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Lock, Mail, User } from "lucide-react";
import { AuthCard } from "#/components/auth/sections/auth-card";
import { AuthFooter } from "#/components/auth/sections/auth-footer";
import { AuthHeader } from "#/components/auth/sections/auth-header";
import { DividerWithText } from "#/components/auth/sections/divider-with-text";
import { SocialProviders } from "#/components/auth/sections/social-providers";
import { SubmitButton } from "#/components/ui/buttons/submit-button";
import { InputField } from "#/components/ui/fields/input-field";
import { useSendOtp, useSignUp } from "#/hooks/auth.hook";
import { SignUpSchema } from "#/server/auth/auth.schemas";

export function SignUpPage() {
	const navigate = useNavigate();
	const { submitSignUp, signUpError } = useSignUp();
	const { submitSendOtp, sendOtpError } = useSendOtp();
	const authError = signUpError || sendOtpError;

	const { reset, Field, Subscribe, handleSubmit } = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		onSubmit: async ({ value }) => {
			const isAccountCreated = await submitSignUp({
				value,
			});

			if (isAccountCreated) {
				sessionStorage.setItem("signUpEmail", value.email);

				const didSendOtp = await submitSendOtp({
					email: value.email,
					type: "email-verification",
				});

				if (didSendOtp) {
					navigate({ to: "/verify-email" });
					reset();
				}
			}
		},
		validators: {
			onSubmit: SignUpSchema,
			onChange: SignUpSchema,
		},
	});

	return (
		<AuthCard>
			<AuthHeader
				title="Create your account"
				subtitle="Start shopping the latest tech in seconds"
			/>

			<SocialProviders />

			<DividerWithText text="or" />

			<Form
				className="flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					handleSubmit();
				}}
			>
				<Field name="name">
					{(field) => {
						const { errors, isTouched } = field.state.meta;
						const error = errors[0]?.message;

						return (
							<InputField
								value={field.state.value}
								onChange={(v) => field.handleChange(v)}
								label="Name"
								type="text"
								placeholder="Jane Doe"
								autoComplete="name"
								icon={<User size={16} />}
								autoFocus
								errorText={isTouched && error ? error : undefined}
							/>
						);
					}}
				</Field>

				<Field name="email">
					{(field) => {
						const { errors, isTouched } = field.state.meta;
						const error = errors[0]?.message;

						return (
							<InputField
								value={field.state.value}
								onChange={(v) => field.handleChange(v)}
								label="Email"
								type="email"
								placeholder="you@example.com"
								autoComplete="email"
								icon={<Mail size={16} />}
								errorText={isTouched && error ? error : undefined}
							/>
						);
					}}
				</Field>

				<Field name="password">
					{(field) => {
						const { errors, isTouched } = field.state.meta;
						const error = errors[0]?.message;

						return (
							<InputField
								value={field.state.value}
								onChange={(v) => field.handleChange(v)}
								label="Password"
								type="password"
								placeholder="••••••••"
								autoComplete="new-password"
								icon={<Lock size={16} />}
								errorText={isTouched && error ? error : undefined}
							/>
						);
					}}
				</Field>

				<Field name="confirmPassword">
					{(field) => {
						const { errors, isTouched } = field.state.meta;
						const error = errors[0]?.message;

						return (
							<InputField
								value={field.state.value}
								onChange={(v) => field.handleChange(v)}
								label="Confirm Password"
								type="password"
								placeholder="••••••••"
								autoComplete="new-password"
								icon={<Lock size={16} />}
								errorText={isTouched && error ? error : undefined}
							/>
						);
					}}
				</Field>

				<Subscribe>
					{({ isSubmitting }) => (
						<SubmitButton
							isLoading={isSubmitting}
							loadingText="Creating account..."
						>
							Create account
						</SubmitButton>
					)}
				</Subscribe>
			</Form>
			{authError && <p className="text-red-500 text-center">{authError}</p>}
			<AuthFooter
				prompt="Already have an account?"
				linkLabel="Sign in"
				linkTo="/sign-in"
			/>
		</AuthCard>
	);
}
