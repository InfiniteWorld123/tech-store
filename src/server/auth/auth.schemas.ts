import { z } from "zod";

const passwordValidation = z
	.string()
	.min(12, "Password must be at least 12 characters long")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[0-9]/, "Password must contain at least one number")
	.regex(
		/[^A-Za-z0-9]/,
		"Password must contain at least one special character",
	);

const emailValidation = z
	.string()
	.email("Please enter a valid email address")
	.toLowerCase()
	.trim();

export const SignUpSchema = z
	.object({
		name: z.string().min(3, "Name must be at least 3 characters long").trim(),
		email: emailValidation,
		password: passwordValidation,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const SignInSchema = z.object({
	email: emailValidation,
	password: z.string().min(1, "Password is required"),
});

export const EmailSchema = z.object({
	email: emailValidation,
});

export const ForgotPasswordSchema = z.object({
	email: emailValidation,
});

export const ResetPasswordSchema = z
	.object({
		password: passwordValidation,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const VerificationCodeSchema = z.object({
	code: z
		.string()
		.length(6, "Verification code must be exactly 6 digits")
		.regex(/^\d+$/, "Code must only contain numbers"),
});
