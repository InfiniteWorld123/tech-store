import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "#/lib/auth-server";
import type { CartOwnerType } from "../cart.types";
import { getOrCreateGuestCartSessionId } from "../utils/get-or-create-guest-cart-session-id";

export const resolveCartOwnerMiddleware = createMiddleware({
	type: "function",
}).server(async ({ next }) => {
	const headers = getRequestHeaders();
	const session = await auth.api.getSession({ headers });

	const cartOwner: CartOwnerType = session
		? {
				userId: session.user.id,
				sessionId: null,
			}
		: {
				userId: null,
				sessionId: getOrCreateGuestCartSessionId(),
			};

	return next({
		context: {
			cartOwner,
		},
	});
});
