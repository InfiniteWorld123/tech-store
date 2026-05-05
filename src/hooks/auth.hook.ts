import { toast } from "@heroui/react";
import { useState } from "react";
import {
	emailOtp,
	requestPasswordReset,
	resetPassword,
	signIn,
	signUp,
} from "#/lib/auth-client";
import type { SignUpType } from "#/server/auth/auth.types";

type OtpType =
	| "sign-in"
	| "change-email"
	| "email-verification"
	| "forget-password";

export const useSendOtp = () => {
	const [sendOtpError, setSendOtpError] = useState<string | null>(null);

	const submitSendOtp = async ({
		email,
		type = "email-verification",
	}: {
		email: string;
		type: OtpType;
	}) => {
		const { error } = await emailOtp.sendVerificationOtp({ email, type });

		if (error) {
			const errMessage =
				error.message ||
				"Failed to send the verification email. Please try again.";
			setSendOtpError(errMessage);
			toast.danger(errMessage);
			return false;
		}

		toast.success("6-digit code sent successfully");
		setSendOtpError(null);
		return true;
	};

	return { submitSendOtp, sendOtpError };
};

export const useSignUp = () => {
	const [signUpError, setSignUpError] = useState<string | null>(null);

	const submitSignUp = async ({ value }: { value: SignUpType }) => {
		const { error } = await signUp.email({
			name: value.name,
			email: value.email,
			password: value.password,
		});

		if (error) {
			const errMessage =
				error.message || "Failed to create account. Please try again.";
			setSignUpError(errMessage);
			toast.danger(errMessage);
			return false;
		}

		toast.success("Account created successfully");
		setSignUpError(null);
		return true;
	};

	return { submitSignUp, signUpError };
};

export const useVerifyEmail = () => {
	const [verifyEmailError, setVerifyEmailError] = useState<string | null>(null);

	const submitVerifyEmail = async ({
		email,
		otp,
	}: {
		email: string;
		otp: string;
	}) => {
		const { error } = await emailOtp.verifyEmail({
			email,
			otp,
		});

		if (error) {
			const errMessage = error.message || "Email verification failed.";
			setVerifyEmailError(errMessage);
			toast.danger(errMessage);
			return false;
		}

		toast.success("Email verified successfully");
		setVerifyEmailError(null);
		return true;
	};

	return { verifyEmailError, submitVerifyEmail };
};

export const useSignIn = () => {
	const [signInError, setSignInError] = useState<string | null>(null);

	const submitSignIn = async ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {
		const { error } = await signIn.email({
			email,
			password,
		});

		if (error) {
			const errMsg = error.message || "Failed to sign in. Please try again.";
			setSignInError(errMsg);
			toast.danger(errMsg);
			return false;
		}

		toast.success("Signed in successfully");
		setSignInError(null);
		return true;
	};

	return { signInError, submitSignIn };
};

export const useRequestResetPassword = () => {
	const [requestResetPasswordError, setRequestResetPasswordError] = useState<
		string | null
	>(null);

	const submitRequestResetPassword = async ({
		email,
		redirectTo,
	}: {
		email: string;
		redirectTo?: string;
	}) => {
		const { error } = await requestPasswordReset({
			email,
			redirectTo: redirectTo ?? `${window.location.origin}/reset-password`,
		});

		if (error) {
			const errMsg = error.message || "Failed to send password reset request.";
			setRequestResetPasswordError(errMsg);
			toast.danger(errMsg);
			return false;
		}

		toast.success("Password reset request sent successfully");
		setRequestResetPasswordError(null);
		return true;
	};

	return { requestResetPasswordError, submitRequestResetPassword };
};

export const useResetPassword = () => {
	const [resetPasswordError, setResetPasswordError] = useState<string | null>(
		null,
	);

	const submitResetPassword = async ({
		password,
		token,
	}: {
		password: string;
		token: string;
	}) => {
		const { error } = await resetPassword({
			newPassword: password,
			token,
		});

		if (error) {
			const errMsg = error.message || "Failed to reset password.";
			setResetPasswordError(errMsg);
			toast.danger(errMsg);
			return false;
		}

		toast.success("Password reset successfully");
		setResetPasswordError(null);
		return true;
	};

	return { resetPasswordError, submitResetPassword };
};
