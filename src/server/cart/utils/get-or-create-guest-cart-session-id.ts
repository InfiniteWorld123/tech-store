import {
	getRequestHeader,
	setResponseHeader,
} from "@tanstack/react-start/server";
import { parseCookie, stringifySetCookie } from "cookie";

const GUEST_CART_SESSION_COOKIE = "guest_cart_session_id";
const GUEST_CART_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export const getGuestCartSessionId = (): string | null => {
	const cookieHeader = getRequestHeader("Cookie") ?? "";
	const cookies = parseCookie(cookieHeader);
	return cookies[GUEST_CART_SESSION_COOKIE] ?? null;
};

export const getOrCreateGuestCartSessionId = (): string => {
	const existingSessionId = getGuestCartSessionId();

	if (existingSessionId) {
		return existingSessionId;
	}

	const sessionId = crypto.randomUUID();

	setResponseHeader(
		"Set-Cookie",
		stringifySetCookie(GUEST_CART_SESSION_COOKIE, sessionId, {
			httpOnly: true,
			maxAge: GUEST_CART_SESSION_MAX_AGE,
			path: "/",
			sameSite: "lax",
		}),
	);

	return sessionId;
};
