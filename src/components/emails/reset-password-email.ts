import { emailLayout } from "./shared";

type ResetPasswordEmailProps = {
	url: string;
	token: string;
};

export const resetPasswordEmailTemplate = ({
	url,
	token,
}: ResetPasswordEmailProps) =>
	emailLayout({
		preview: "Reset your Tech Store password.",
		title: "Reset your password",
		body: "We received a request to reset your Tech Store password. Use the button below to choose a new password.",
		action: {
			label: "Reset password",
			url,
		},
		code: token,
		footer:
			"This password reset link expires soon. If you did not request it, no changes were made to your account.",
	});
