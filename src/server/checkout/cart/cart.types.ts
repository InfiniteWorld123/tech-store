import type z from "zod";
import type {
	addToCartValidationSchema,
	removeCartItemValidationSchema,
	updateCartItemQuantityValidationSchema,
} from "./cart.schemas";

export type AddToCartSchemaType = z.infer<typeof addToCartValidationSchema>;
export type UpdateCartItemQuantitySchemaType = z.infer<
	typeof updateCartItemQuantityValidationSchema
>;

export type RemoveCartItemSchemaType = z.infer<
	typeof removeCartItemValidationSchema
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

export type RemoveCartItemInputType = RemoveCartItemSchemaType & CartOwnerType;

// using them for the cart services as return output
export type CartOutputType = CartType;

export type AddToCartOutputType = CartType;

export type EmptyCartOutputType = CartType;

export type UpdateCartItemQuantityOutputType = CartType;

export type RemoveCartItemOutputType = CartType;


/*
	1. User is not logged in.
	2. User adds iPhone to cart.
	3. Cart belongs to guest sessionId cookie.
	4. User logs in.
	5. Now you want guest cart items to move into the user cart.
*/

/*
	- cart exists
	- cart is not empty
	- every product is still active
	- every variant still exists
	- every item has enough stock
	- prices did not change, or customer accepted new prices
*/