import { z } from "zod";

export const getCartValidationSchema = z.object({});

export const addToCartValidationSchema = z.object({
	variantId: z.string().uuid("Variant id must be a valid UUID"),
	quantity: z.number().int().min(1).max(99).default(1),
});

export const emptyCartValidationSchema = z.object({});

export const updateCartItemQuantityValidationSchema = addToCartValidationSchema;

export const removeCartItemValidationSchema = z.object({
	cartItemId: z.string().uuid("Cart item id must be a valid UUID"),
});
