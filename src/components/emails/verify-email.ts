import { emailLayout } from "./shared";

type VerifyEmailProps = {
	otp: string;
};

export const verifyEmailTemplate = ({ otp }: VerifyEmailProps) =>
	emailLayout({
		preview: "Verify your Tech Store email address.",
		title: "Verify your email",
		body: "Use this verification code to finish setting up your Tech Store account.",
		code: otp,
		footer:
			"This code expires soon. If you did not request it, you can safely ignore this email.",
	});
