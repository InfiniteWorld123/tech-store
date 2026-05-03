import type z from "zod";
import type {
	addToCartValidationSchema,
	updateCartItemQuantityValidationSchema,
} from "./cart.schemas";

export type AddToCartSchemaType = z.infer<typeof addToCartValidationSchema>;
export type UpdateCartItemQuantitySchemaType = z.infer<
	typeof updateCartItemQuantityValidationSchema
>;

export type CartWarningType = {
	type: "price_changed" | "out_of_stock" | "low_stock" | "product_unavailable";

	cartItemId: string | null;
	variantId: string | null;
	productId: string | null;

	message: string;
};

export type CartSummaryType = {
	itemsCount: number;
	uniqueItemsCount: number;
	subtotal: number;

	hasUnavailableItems: boolean;
	hasOutOfStockItems: boolean;
	hasLowStockItems: boolean;
	hasPriceChanges: boolean;

	canCheckout: boolean;
};

export type CartProductType = {
	id: string;
	name: string;
	slug: string;
	brand: string;
	image: string | null;
	isActive: boolean;
};

export type CartVariantType = {
	id: string;
	sku: string;
	price: number;
	compareAtPrice: number | null;
	stockQuantity: number;
	isDefault: boolean;
	options: {
		color: string | null;
		storage: string | null;
		ram: string | null;
		screenSize: string | null;
	};
	displayName: string;
};

export type CartItemType = {
	id: string;
	cartId: string;
	variantId: string;
	productId: string;

	product: CartProductType;
	variant: CartVariantType;

	quantity: number;
	priceAtTime: number;
	currentPrice: number;
	lineTotal: number;

	isAvailable: boolean;
	hasPriceChanged: boolean;
	isLowStock: boolean;

	createdAt: string;
	updatedAt: string;
};

export type CartType = {
	id: string;
	userId: string | null;
	sessionId: string | null;

	items: CartItemType[];

	summary: CartSummaryType;
	warnings: CartWarningType[];

	createdAt: string;
	updatedAt: string;
};

export type CartOwnerType = {
	userId: string | null;
	sessionId: string | null;
};

// using them for the cart services as return input
export type GetCartInputType = CartOwnerType;

export type AddToCartInputType = AddToCartSchemaType & CartOwnerType;

export type EmptyCartInputType = CartOwnerType;

export type UpdateCartItemQuantityInputType = UpdateCartItemQuantitySchemaType &
	CartOwnerType;

// using them for the cart services as return output
export type CartOutputType = CartType;

export type AddToCartOutputType = CartType;

export type EmptyCartOutputType = CartType;

export type UpdateCartItemQuantityOutputType = CartType;

/*
  updateCartItemQuantity flow

  1. Read input:
     - userId
     - sessionId
     - variantId
     - quantity

  2. Check cart owner:
     - if no userId and no sessionId, throw unauthorizedError

  3. Build cart owner condition:
     - if userId exists, use cart.userId
     - otherwise use cart.sessionId

  4. Find the cart item that belongs to this owner:
     - from cartItem
     - innerJoin cart on cart.id = cartItem.cartId
     - where cartItem.variantId = variantId
     - and cart owner condition

  5. If cart item does not exist:
     - throw notFoundError("Cart item not found")

  6. Fetch current variant stock and price:
     - from variant
     - where variant.id = variantId

  7. If variant does not exist:
     - throw notFoundError("Variant not found")

  8. Check stock:
     - if variant.stockQuantity <= 0, throw conflictError("Out of stock")
     - if quantity > variant.stockQuantity, throw conflictError("Requested quantity exceeds available stock")

  9. Update cart item:
     - set quantity to the new quantity
     - optionally update priceAtTime to current variant.price
     - where cartItem.id = existingCartItem.id

  10. Return updated cart:
      - return getCart({ userId, sessionId })

  Business meaning:
  - addToCart increases quantity
  - updateCartItemQuantity replaces quantity
  - removeCartItem removes the item
*/
