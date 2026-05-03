import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import {
	cart,
	cartItem,
	color,
	product,
	ram,
	screenSize,
	storage,
	variant,
} from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	CartOutputType,
	CartSummaryType,
	CartType,
	CartWarningType,
	GetCartInputType,
} from "../cart.types";

export const getCart = async (
	data: GetCartInputType,
): Promise<JsonOk<CartOutputType>> => {
	try {
		const { userId, sessionId } = data;
		const cartOwnerCondition = userId
			? eq(cart.userId, userId)
			: eq(cart.sessionId, sessionId as string);

		const [existingCart] = await db
			.select({
				id: cart.id,
				userId: cart.userId,
				sessionId: cart.sessionId,
				createdAt: cart.createdAt,
				updatedAt: cart.updatedAt,
			})
			.from(cart)
			.where(cartOwnerCondition);

		if (!existingCart) {
			return jsonOk<CartOutputType>({
				status: HttpStatusCode.OK,
				message: "Cart fetched successfully",
				data: {
					id: "",
					userId,
					sessionId,
					items: [],
					summary: {
						itemsCount: 0,
						uniqueItemsCount: 0,
						subtotal: 0,
						hasUnavailableItems: false,
						hasOutOfStockItems: false,
						hasLowStockItems: false,
						hasPriceChanges: false,
						canCheckout: false,
					},
					warnings: [],
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			});
		}

		const cartItemRows = await db
			.select({
				cartItemId: cartItem.id,
				cartId: cartItem.cartId,
				variantId: cartItem.variantId,
				quantity: cartItem.quantity,
				priceAtTime: cartItem.priceAtTime,
				cartItemCreatedAt: cartItem.createdAt,
				cartItemUpdatedAt: cartItem.updatedAt,

				productId: product.id,
				productName: product.name,
				productSlug: product.slug,
				productBrand: product.brand,
				productImage: product.image,
				productIsActive: product.isActive,

				variantSku: variant.sku,
				variantPrice: variant.price,
				variantCompareAtPrice: variant.compareAtPrice,
				variantStockQuantity: variant.stockQuantity,
				variantIsDefault: variant.isDefault,

				colorName: color.name,
				storageName: storage.name,
				ramName: ram.name,
				screenSizeName: screenSize.name,
			})
			.from(cartItem)
			.innerJoin(variant, eq(variant.id, cartItem.variantId))
			.innerJoin(product, eq(product.id, variant.productId))
			.leftJoin(color, eq(color.id, variant.colorId))
			.leftJoin(storage, eq(storage.id, variant.storageId))
			.leftJoin(ram, eq(ram.id, variant.ramId))
			.leftJoin(screenSize, eq(screenSize.id, variant.screenSizeId))
			.where(eq(cartItem.cartId, existingCart.id));

		const items = cartItemRows.map((row) => {
			const priceAtTime = Number(row.priceAtTime);
			const currentPrice = Number(row.variantPrice);
			const compareAtPrice =
				row.variantCompareAtPrice === null
					? null
					: Number(row.variantCompareAtPrice);
			const lineTotal = currentPrice * row.quantity;

			const hasPriceChanged = priceAtTime !== currentPrice;
			const isOutOfStock = row.variantStockQuantity <= 0;
			const isLowStock =
				row.variantStockQuantity > 0 && row.variantStockQuantity <= 5;
			const isAvailable = row.productIsActive && !isOutOfStock;

			const displayName = [
				row.colorName,
				row.storageName,
				row.ramName,
				row.screenSizeName,
			]
				.filter(Boolean)
				.join(" / ");

			return {
				id: row.cartItemId,
				cartId: row.cartId,
				variantId: row.variantId,
				productId: row.productId,

				product: {
					id: row.productId,
					name: row.productName,
					slug: row.productSlug,
					brand: row.productBrand,
					image: row.productImage,
					isActive: row.productIsActive,
				},

				variant: {
					id: row.variantId,
					sku: row.variantSku,
					price: currentPrice,
					compareAtPrice,
					stockQuantity: row.variantStockQuantity,
					isDefault: row.variantIsDefault,
					options: {
						color: row.colorName,
						storage: row.storageName,
						ram: row.ramName,
						screenSize: row.screenSizeName,
					},
					displayName,
				},

				quantity: row.quantity,
				priceAtTime,
				currentPrice,
				lineTotal,

				isAvailable,
				hasPriceChanged,
				isLowStock,

				createdAt: row.cartItemCreatedAt.toISOString(),
				updatedAt: row.cartItemUpdatedAt.toISOString(),
			};
		});

		const warnings = items.flatMap((item) => {
			const itemWarnings: CartWarningType[] = [];

			if (!item.product.isActive) {
				itemWarnings.push({
					type: "product_unavailable",
					cartItemId: item.id,
					variantId: item.variantId,
					productId: item.productId,
					message: `${item.product.name} is no longer available.`,
				});
			}

			if (item.variant.stockQuantity <= 0) {
				itemWarnings.push({
					type: "out_of_stock",
					cartItemId: item.id,
					variantId: item.variantId,
					productId: item.productId,
					message: `${item.product.name} is out of stock.`,
				});
			}

			if (item.isLowStock) {
				itemWarnings.push({
					type: "low_stock",
					cartItemId: item.id,
					variantId: item.variantId,
					productId: item.productId,
					message: `Only ${item.variant.stockQuantity} left for ${item.product.name}.`,
				});
			}

			if (item.hasPriceChanged) {
				itemWarnings.push({
					type: "price_changed",
					cartItemId: item.id,
					variantId: item.variantId,
					productId: item.productId,
					message: `${item.product.name} price changed from ${item.priceAtTime} to ${item.currentPrice}.`,
				});
			}

			return itemWarnings;
		});

		const summary: CartSummaryType = {
			itemsCount: items.reduce((total, item) => total + item.quantity, 0),
			uniqueItemsCount: items.length,
			subtotal: items.reduce((total, item) => total + item.lineTotal, 0),

			hasUnavailableItems: items.some((item) => !item.isAvailable),
			hasOutOfStockItems: items.some((item) => item.variant.stockQuantity <= 0),
			hasLowStockItems: items.some((item) => item.isLowStock),
			hasPriceChanges: items.some((item) => item.hasPriceChanged),

			canCheckout:
				items.length > 0 &&
				items.every((item) => item.isAvailable && !item.hasPriceChanged),
		};

		const cartResponse: CartType = {
			id: existingCart.id,
			userId: existingCart.userId,
			sessionId: existingCart.sessionId,
			items,
			summary,
			warnings,
			createdAt: existingCart.createdAt.toISOString(),
			updatedAt: existingCart.updatedAt.toISOString(),
		};

		return jsonOk<CartOutputType>({
			status: HttpStatusCode.OK,
			message: "Cart fetched successfully",
			data: cartResponse,
		});
	} catch (error) {
		throw handleError(error);
	}
};
 