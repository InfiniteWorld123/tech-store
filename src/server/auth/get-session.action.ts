import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import { auth } from "#/lib/auth-server";

export const getSessionAction = createServerFn({ method: "GET" })
	.inputValidator(z.object({}))
	.handler(async () => {
		const headers = getRequestHeaders();
		const session = await auth.api.getSession({ headers });
		return { user: session?.user ?? null };
	});
