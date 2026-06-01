import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { db } from "#/db/drizzle";
import { user } from "#/db/schema";
import { forbiddenError, unauthorizedError } from "#/errors/app-error";
import { auth } from "#/lib/auth-server";
import { isAdminRole } from "./user-roles";

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

export const ensureAdmin = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		const headers = getRequestHeaders();
		const session = await auth.api.getSession({ headers });

		if (!session) {
			throw unauthorizedError("User is unauthorized");
		}

		const [currentUser] = await db
			.select({
				id: user.id,
				role: user.role,
			})
			.from(user)
			.where(eq(user.id, session.user.id));

		if (!currentUser) {
			throw unauthorizedError("User is unauthorized");
		}

		// Only admins can use dashboard actions like product editing and refunds.
		if (!isAdminRole(currentUser.role)) {
			throw forbiddenError("Admin access is required");
		}

		return next({
			context: {
				session,
				currentUser,
			},
		});
	},
);
