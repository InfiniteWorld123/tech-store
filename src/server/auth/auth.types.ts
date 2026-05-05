import type z from "zod";
import type {
	EmailSchema,
	ForgotPasswordSchema,
	ResetPasswordSchema,
	SignInSchema,
	SignUpSchema,
	VerificationCodeSchema,
} from "./auth.schemas";

export type SignUpType = z.infer<typeof SignUpSchema>;
export type SignInType = z.infer<typeof SignInSchema>;
export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;
export type VerificationCodeType = z.infer<typeof VerificationCodeSchema>;
export type EmailType = z.infer<typeof EmailSchema>;
