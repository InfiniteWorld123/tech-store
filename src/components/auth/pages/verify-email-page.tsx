import { Form, toast } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthCard } from "#/components/auth/sections/auth-card";
import { AuthHeader } from "#/components/auth/sections/auth-header";
import { SubmitButton } from "#/components/ui/buttons/submit-button";
import { OtpField } from "#/components/ui/fields/otp-field";
import { useSendOtp, useVerifyEmail } from "#/hooks/auth.hook";

export function VerifyEmailPage() {
	const navigate = useNavigate();
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);
	const { verifyEmailError, submitVerifyEmail } = useVerifyEmail();
	const { submitSendOtp, sendOtpError } = useSendOtp();
	const displayErrMsg = errorMsg || verifyEmailError || sendOtpError;

	const { reset, Subscribe, Field, handleSubmit } = useForm({
		defaultValues: {
			code: "",
		},
		onSubmit: async ({ value }) => {
			if (email) {
				const isEmailVerified = await submitVerifyEmail({
					email,
					otp: value.code,
				});

				if (isEmailVerified) {
					navigate({ to: "/" });
					reset();
				}
			}
		},
	});

	const onResend = async () => {
		if (!email) return;

		await submitSendOtp({
			email,
			type: "email-verification",
		});
	};

	useEffect(() => {
		if (typeof window === "undefined") return;

		const storedEmail = window.sessionStorage.getItem("signUpEmail");

		if (!storedEmail) {
			setErrorMsg("Email is missing. Please sign up again.");
			toast.danger("Email is missing. Please sign up again");
			navigate({ to: "/sign-up" });
			return;
		}

		setEmail(storedEmail);
	}, [navigate]);

	return (
		<AuthCard>
			<AuthHeader
				title="Verify your email"
				subtitle="We sent a 6-digit code to your inbox. Enter it below to continue."
			/>

			<Form
				className="flex flex-col items-center gap-6"
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<Field name="code">
					{(field) => {
						return (
							<OtpField
								autoFocus
								value={field.state.value}
								onChange={(value) => field.handleChange(value)}
							/>
						);
					}}
				</Field>

				<Subscribe
					selector={(state) => ({
						code: state.values.code,
						isSubmitting: state.isSubmitting,
					})}
				>
					{({ code, isSubmitting }) => (
						<SubmitButton
							isDisabled={code.length !== 6}
							isLoading={isSubmitting}
							loadingText="Verifying email..."
						>
							Verify email
						</SubmitButton>
					)}
				</Subscribe>

				{displayErrMsg && (
					<p className="text-red-500 text-center">{displayErrMsg}</p>
				)}
			</Form>

			<p className="text-center text-sm text-muted">
				Didn't get a code?{" "}
				<button
					type="button"
					className="font-medium text-accent hover:underline"
					onClick={onResend}
				>
					Resend
				</button>
			</p>
		</AuthCard>
	);
}
