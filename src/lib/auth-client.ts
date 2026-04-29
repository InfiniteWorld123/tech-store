import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const {
	signIn,
	signUp,
	emailOtp,
	useSession,
	requestPasswordReset,
	resetPassword,
} = createAuthClient({
	plugins: [emailOTPClient()],
});
