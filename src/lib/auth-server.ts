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
		sendResetPassword: async ({ user, url, token }, request) => {
			console.log(user)
			console.log(url)
			console.log(token)
			console.log(request)
		},
		onPasswordReset: async ({ user }, request) => {
			console.log(user)
			console.log(request)
		},
	},
	plugins: [
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				if (type === "email-verification") {
					console.log(email)
					console.log(otp)
					console.log(type)
				}
			},
		}),
		tanstackStartCookies(), // make sure this is the last plugin in the array
	],
});
