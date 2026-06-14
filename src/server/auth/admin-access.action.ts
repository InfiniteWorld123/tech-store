import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db/drizzle";
import { user } from "#/db/schema";
import { auth } from "#/lib/auth-server";
import { isAdminRole } from "./user-roles";

export const getAdminAccessAction = createServerFn({ method: "GET" })
	.inputValidator(z.object({}))
	.handler(async () => {
		const headers = getRequestHeaders();
		const session = await auth.api.getSession({ headers });

		if (!session) {
			return { isAdmin: false };
		}

		const [currentUser] = await db
			.select({ role: user.role })
			.from(user)
			.where(eq(user.id, session.user.id));

		return {
			isAdmin: isAdminRole(currentUser?.role),
		};
	});
