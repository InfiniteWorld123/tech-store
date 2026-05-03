import { createServerFn } from "@tanstack/react-start";
import {
	addToCartValidationSchema,
	emptyCartValidationSchema,
	getCartValidationSchema,
	updateCartItemQuantityValidationSchema,
} from "./cart.schemas";
import { resolveCartOwnerMiddleware } from "./resolveCartOwnerMiddleware";
import { addToCart } from "./services/add-to-cart.service";
import { emptyCart } from "./services/empty-cart.service";
import { getCart } from "./services/get-cart.service";
import { updateCartItemQuantity } from "./services/update-cart-item-quantity.service";

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
	.inputValidator(emptyCartValidationSchema)
	.handler(async ({ context }) => {
		return emptyCart(context.cartOwner);
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
