import type z from "zod";
import type {
	addToCartSchema,
	removeCartItemSchema,
	updateCartItemQuantitySchema,
} from "./cart.schemas";

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

export type AddToCartInputType = z.infer<typeof addToCartSchema> &
	CartOwnerType;

export type ClearCartInputType = CartOwnerType;

export type UpdateCartItemQuantityInputType = z.infer<
	typeof updateCartItemQuantitySchema
> &
	CartOwnerType;

export type RemoveCartItemInputType = z.infer<typeof removeCartItemSchema> &
	CartOwnerType;

export type MergeCartInputType = {
	userId: string;
	sessionId: string | null;
};

export type ValidateCartInputType = CartOwnerType;

// using them for the cart services as return output
export type CartOutputType = {
	cart: CartType;
};

export type AddToCartOutputType = CartOutputType;

export type ClearCartOutputType = CartOutputType;

export type UpdateCartItemQuantityOutputType = CartOutputType;

export type RemoveCartItemOutputType = CartOutputType;

export type MergeCartOutputType = CartOutputType;

export type ValidateCartOutputType = {
	isValid: boolean;
	cart: CartType;
	blockingWarnings: CartWarningType[];
};

/*
	user has a cart
	cart is not empty
	cart belongs to this user
	address belongs to this user
	products are active
	variants are in stock
	cart prices did not change
	quantity is available
*/
