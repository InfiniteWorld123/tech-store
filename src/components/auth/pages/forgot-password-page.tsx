import { Form } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { Mail } from "lucide-react";
import { AuthAlert } from "#/components/auth/sections/auth-alert";
import { AuthCard } from "#/components/auth/sections/auth-card";
import { AuthFooter } from "#/components/auth/sections/auth-footer";
import { AuthHeader } from "#/components/auth/sections/auth-header";
import { SubmitButton } from "#/components/ui/buttons/submit-button";
import { InputField } from "#/components/ui/fields/input-field";
import { useRequestResetPassword } from "#/hooks/auth.hook";
import { EmailSchema } from "#/server/auth/auth.schemas";

export function ForgotPasswordPage() {
	const { requestResetPasswordError, submitRequestResetPassword } =
		useRequestResetPassword();

	const { reset, Subscribe, Field, handleSubmit } = useForm({
		defaultValues: {
			email: "",
		},
		onSubmit: async ({ value }) => {
			const didSendRequestPassword = await submitRequestResetPassword({
				email: value.email,
			});
			if (didSendRequestPassword) {
				reset();
			}
		},
		validators: {
			onSubmit: EmailSchema,
			onChange: EmailSchema,
		},
	});

	return (
		<AuthCard>
			<AuthHeader
				title="Forgot your password?"
				subtitle="Enter your email and we'll send you a link to reset it."
			/>

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
							onChange={(v) => field.handleChange(v)}
							label="Email"
							type="email"
							placeholder="you@example.com"
							autoComplete="email"
							icon={<Mail size={16} />}
							autoFocus
						/>
					)}
				</Field>

				<Subscribe>
					{({ isSubmitting }) => (
						<SubmitButton
							isLoading={isSubmitting}
							loadingText="Sending reset link..."
						>
							Send reset link
						</SubmitButton>
					)}
				</Subscribe>

				{requestResetPasswordError && (
					<AuthAlert message={requestResetPasswordError} />
				)}
			</Form>

			<AuthFooter
				prompt="Remembered it?"
				linkLabel="Back to sign in"
				linkTo="/sign-in"
			/>
		</AuthCard>
	);
}
