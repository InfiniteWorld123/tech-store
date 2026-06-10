import { Form, toast } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthAlert } from "#/components/auth/sections/auth-alert";
import { AuthCard } from "#/components/auth/sections/auth-card";
import { AuthHeader } from "#/components/auth/sections/auth-header";
import { SubmitButton } from "#/components/ui/buttons/submit-button";
import { InputField } from "#/components/ui/fields/input-field";
import { useResetPassword } from "#/hooks/use-auth";
import { ResetPasswordSchema } from "#/server/auth/auth.schemas";

type ResetPasswordPageProps = {
	token: string | undefined;
	searchError: string | undefined;
};

export function ResetPasswordPage({
	token,
	searchError,
}: ResetPasswordPageProps) {
	const navigate = useNavigate();
	const { resetPasswordError, submitResetPassword } = useResetPassword();
	const resolvedSearchError =
		searchError === "INVALID_TOKEN"
			? "This reset link is invalid or expired. Please request a new one."
			: searchError;
	const [displayErrMsg, setDisplayErrMsg] = useState<string | null>(null);

	const { reset, Subscribe, Field, handleSubmit } = useForm({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		validators: {
			onSubmit: ResetPasswordSchema,
			onChange: ResetPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			if (!token || resolvedSearchError) {
				const message = resolvedSearchError || "Reset token not found";
				setDisplayErrMsg(message);
				toast.danger(message);
				return;
			}

			const didResetPassword = await submitResetPassword({
				password: value.password,
				token: token as string,
			});

			if (didResetPassword) {
				reset();
				navigate({ to: "/sign-in" });
			}
		},
	});

	useEffect(() => {
		if (resolvedSearchError) {
			setDisplayErrMsg(resolvedSearchError);
			return;
		}

		if (resetPasswordError) {
			setDisplayErrMsg(resetPasswordError);
			return;
		}

		if (!token) {
			navigate({ to: "/forgot-password", replace: true });
		}
	}, [navigate, resetPasswordError, resolvedSearchError, token]);

	return (
		<AuthCard>
			<AuthHeader
				title="Set a new password"
				subtitle="Choose a strong password you haven't used before."
			/>

			<Form
				className="flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<Field name="password">
					{(field) => {
						const { errors, isTouched } = field.state.meta;
						const error = errors[0]?.message;

						return (
							<InputField
								value={field.state.value}
								onChange={(v) => field.handleChange(v)}
								type="password"
								label="New password"
								placeholder="••••••••"
								autoComplete="new-password"
								icon={<Lock size={16} />}
								autoFocus
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
								type="password"
								label="Confirm new password"
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
							loadingText="Changing password..."
						>
							Change password
						</SubmitButton>
					)}
				</Subscribe>

				{displayErrMsg ? <AuthAlert message={displayErrMsg} /> : null}
			</Form>
		</AuthCard>
	);
}
