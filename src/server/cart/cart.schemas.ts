import { z } from "zod";

export const getCartSchema = z.object({});

export const addToCartSchema = z.object({
	variantId: z.string().uuid("Variant id must be a valid UUID"),
	quantity: z.number().int().min(1).max(99).default(1),
});

export const clearCartSchema = z.object({});

export const updateCartItemQuantitySchema = addToCartSchema;

export const removeCartItemSchema = z.object({
	cartItemId: z.string().uuid("Cart item id must be a valid UUID"),
});

export const mergeCartSchema = z.object({});
export const validateCartSchema = z.object({});
