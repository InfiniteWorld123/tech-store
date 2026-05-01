import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "#/lib/auth-server";
import type { CartOwnerType } from "./cart.types";
import { getOrCreateGuestCartSessionId } from "./middlewares/getOrCreateGuestCartSessionId";

export const resolveCartOwnerMiddleware = createMiddleware({
	type: "function",
}).server(async ({ next }) => {
	const headers = getRequestHeaders();

	const session = await auth.api.getSession({ headers });

	if (session) {
		const cartOwner: CartOwnerType = {
			userId: session.user.id,
			sessionId: null,
		};

		return next({
			context: {
				cartOwner,
			},
		});
	}

	const sessionId = getOrCreateGuestCartSessionId();

	const cartOwner: CartOwnerType = {
		userId: null,
		sessionId,
	};

	return next({
		context: {
			cartOwner,
		},
	});
});
