import { createServerFn } from "@tanstack/react-start";
import { unauthorizedError } from "#/errors/app-error";
import { ensureSession } from "#/server/auth/ensure-session.middleware";
import {
	addToCartValidationSchema,
	getCartValidationSchema,
} from "./cart.schemas";
import { resolveCartOwnerMiddleware } from "./resolveCartOwnerMiddleware";
import { addToCart } from "./services/add-to-cart.service";
import { getCart } from "./services/get-cart.service";

export const getCartAction = createServerFn({ method: "GET" })
	.middleware([ensureSession])
	.inputValidator(getCartValidationSchema)
	.handler(async ({ context }) => {
		if (!context.session) {
			throw unauthorizedError("user is unauthorized");
		}
		return getCart({ userId: context.session.user.id, sessionId: null });
	});

export const addToCartAction = createServerFn({ method: "POST" })
	.middleware([resolveCartOwnerMiddleware])
	.inputValidator(addToCartValidationSchema)
	.handler(async ({ data, context }) => {
		return addToCart({
			...data,
			...context.cartOwner,
		});
	});
