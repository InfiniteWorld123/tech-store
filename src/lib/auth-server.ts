import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "#/db/drizzle";
import * as schema from "#/db/schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url, token }) => {
			console.info("[auth] password reset requested", {
				email: user.email,
				url,
				token,
			});
		},
		onPasswordReset: async ({ user }) => {
			console.info("[auth] password reset completed", {
				email: user.email,
				userId: user.id,
			});
		},
	},
	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				if (type === "email-verification") {
					console.info("[auth] verification OTP requested", {
						email,
						otp,
						type,
					});
				}
			},
		}),
		tanstackStartCookies(), // make sure this is the last plugin in the array
	],
});
