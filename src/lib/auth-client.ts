import {
	emailOTPClient,
	inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth-server";

export const {
	signIn,
	signUp,
	emailOtp,
	useSession,
	requestPasswordReset,
	resetPassword,
	updateUser,
	changePassword,
	changeEmail,
	signOut,
} = createAuthClient({
	plugins: [emailOTPClient(), inferAdditionalFields<typeof auth>()],
});
