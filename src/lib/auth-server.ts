import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import {
	resetPasswordEmailTemplate,
	verifyEmailTemplate,
	welcomeEmailTemplate,
} from "#/components/emails";
import { env } from "#/constants/env";
import { db } from "#/db/drizzle";
import * as schema from "#/db/schema";
import { sendEmail } from "./mailer";

const googleProvider =
	env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
		? {
				google: {
					clientId: env.GOOGLE_CLIENT_ID,
					clientSecret: env.GOOGLE_CLIENT_SECRET,
				},
			}
		: undefined;

export const auth = betterAuth({
	baseURL: env.BASE_URL,
	secret: env.BETTER_AUTH_SECRET,
	trustedOrigins: [env.BASE_URL],
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	socialProviders: googleProvider,
	user: {
		additionalFields: {
			role: {
				type: "string",
				defaultValue: "customer",
				input: false,
			},
		},
	},
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					await sendEmail({
						to: user.email,
						subject: "Welcome to Tech Store",
						html: welcomeEmailTemplate({
							name: user.name,
							url: env.BASE_URL,
						}),
					});
				},
			},
		},
	},
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url, token }) => {
			await sendEmail({
				to: user.email,
				subject: "Reset your Tech Store password",
				html: resetPasswordEmailTemplate({ url, token }),
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
					await sendEmail({
						to: email,
						subject: "Verify your Tech Store email",
						html: verifyEmailTemplate({ otp }),
					});
				}
			},
		}),
		tanstackStartCookies(), // make sure this is the last plugin in the array
	],
});
