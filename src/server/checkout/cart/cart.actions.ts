import { createServerFn } from "@tanstack/react-start";
import {
	addToCartValidationSchema,
	clearCartValidationSchema,
	getCartValidationSchema,
	mergeCartValidationSchema,
	removeCartItemValidationSchema,
	updateCartItemQuantityValidationSchema,
	validateCartValidationSchema,
} from "./cart.schemas";
import { resolveCartOwnerMiddleware } from "./middlewares/resolveCartOwnerMiddleware";
import { resolveMergeCartOwnerMiddleware } from "./middlewares/resolveMergeCartOwnerMiddleware";
import { addToCart } from "./services/add-to-cart.service";
import { clearCart } from "./services/clear-cart.service";
import { getCart } from "./services/get-cart.service";
import { mergeCart } from "./services/merge-cart.service";
import { removeCartItem } from "./services/remove-cart-item.service";
import { updateCartItemQuantity } from "./services/update-cart-item-quantity.service";
import { validateCart } from "./services/validate-cart.service";

export const getCartAction = createServerFn({ method: "GET" })
	.middleware([resolveCartOwnerMiddleware])
	.inputValidator(getCartValidationSchema)
	.handler(async ({ context }) => {
		return getCart(context.cartOwner);
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

export const clearCartAction = createServerFn({ method: "POST" })
	.middleware([resolveCartOwnerMiddleware])
	.inputValidator(clearCartValidationSchema)
	.handler(async ({ context }) => {
		return clearCart(context.cartOwner);
	});

export const updateCartItemQuantityAction = createServerFn({ method: "POST" })
	.middleware([resolveCartOwnerMiddleware])
	.inputValidator(updateCartItemQuantityValidationSchema)
	.handler(async ({ context, data }) => {
		return updateCartItemQuantity({
			...data,
			...context.cartOwner,
		});
	});

export const removeCartItemAction = createServerFn({ method: "POST" })
	.middleware([resolveCartOwnerMiddleware])
	.inputValidator(removeCartItemValidationSchema)
	.handler(async ({ context, data }) => {
		return removeCartItem({
			...data,
			...context.cartOwner,
		});
	});

export const mergeCartAction = createServerFn({ method: "POST" })
	.middleware([resolveMergeCartOwnerMiddleware])
	.inputValidator(mergeCartValidationSchema)
	.handler(async ({ context }) => {
		return mergeCart(context.mergeCartOwner);
	});

export const validateCartAction = createServerFn({ method: "GET" })
	.middleware([resolveCartOwnerMiddleware])
	.inputValidator(validateCartValidationSchema)
	.handler(async ({ context }) => {
		return validateCart(context.cartOwner);
	});
