import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { unauthorizedError } from "#/errors/app-error";
import { auth } from "#/lib/auth-server";

export const ensureSession = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		const headers = getRequestHeaders();
		const session = await auth.api.getSession({ headers });

		if (!session) {
			throw unauthorizedError("User is unauthorized");
		}

		return next({
			context: {
				session,
			},
		});
	},
);
