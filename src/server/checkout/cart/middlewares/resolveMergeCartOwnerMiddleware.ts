import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { unauthorizedError } from "#/errors/app-error";
import { auth } from "#/lib/auth-server";
import type { MergeCartInputType } from "../cart.types";
import { getGuestCartSessionId } from "../utils/get-or-create-guest-cart-session-id";

export const resolveMergeCartOwnerMiddleware = createMiddleware({
	type: "function",
}).server(async ({ next }) => {
	const headers = getRequestHeaders();
	const session = await auth.api.getSession({ headers });

	if (!session) {
		throw unauthorizedError("user is unauthorized");
	}

	const mergeCartOwner: MergeCartInputType = {
		userId: session.user.id,
		sessionId: getGuestCartSessionId(),
	};

	return next({
		context: {
			mergeCartOwner,
		},
	});
});
