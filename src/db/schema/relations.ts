import { relations } from "drizzle-orm";
import { account, session, user } from "./auth";
import {
	category,
	color,
	product,
	ram,
	screenSize,
	storage,
	variant,
	variantImage,
} from "./catalog";
import {
	cart,
	cartItem,
	order,
	orderItem,
	payment,
	shipping,
} from "./checkout";
import { address, review } from "./customers";

export const userRelations = relations(user, ({ many, one }) => ({
	sessions: many(session),
	accounts: many(account),
	addresses: many(address),
	cart: one(cart),
	orders: many(order),
	reviews: many(review),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const categoryRelations = relations(category, ({ many }) => ({
	products: many(product),
}));

export const productRelations = relations(product, ({ one, many }) => ({
	category: one(category, {
		fields: [product.categoryId],
		references: [category.id],
	}),
	variants: many(variant),
	reviews: many(review),
}));

export const variantRelations = relations(variant, ({ one, many }) => ({
	product: one(product, {
		fields: [variant.productId],
		references: [product.id],
	}),
	color: one(color, {
		fields: [variant.colorId],
		references: [color.id],
	}),
	storage: one(storage, {
		fields: [variant.storageId],
		references: [storage.id],
	}),
	ram: one(ram, {
		fields: [variant.ramId],
		references: [ram.id],
	}),
	screenSize: one(screenSize, {
		fields: [variant.screenSizeId],
		references: [screenSize.id],
	}),
	images: many(variantImage),
	cartItems: many(cartItem),
	orderItems: many(orderItem),
}));

export const variantImageRelations = relations(variantImage, ({ one }) => ({
	variant: one(variant, {
		fields: [variantImage.variantId],
		references: [variant.id],
	}),
}));

export const colorRelations = relations(color, ({ many }) => ({
	variants: many(variant),
}));

export const storageRelations = relations(storage, ({ many }) => ({
	variants: many(variant),
}));

export const ramRelations = relations(ram, ({ many }) => ({
	variants: many(variant),
}));

export const screenSizeRelations = relations(screenSize, ({ many }) => ({
	variants: many(variant),
}));

export const addressRelations = relations(address, ({ one, many }) => ({
	user: one(user, {
		fields: [address.userId],
		references: [user.id],
	}),
	orders: many(order),
}));

export const cartRelations = relations(cart, ({ one, many }) => ({
	user: one(user, {
		fields: [cart.userId],
		references: [user.id],
	}),
	items: many(cartItem),
}));

export const cartItemRelations = relations(cartItem, ({ one }) => ({
	cart: one(cart, {
		fields: [cartItem.cartId],
		references: [cart.id],
	}),
	variant: one(variant, {
		fields: [cartItem.variantId],
		references: [variant.id],
	}),
}));

export const orderRelations = relations(order, ({ one, many }) => ({
	user: one(user, {
		fields: [order.userId],
		references: [user.id],
	}),
	address: one(address, {
		fields: [order.addressId],
		references: [address.id],
	}),
	items: many(orderItem),
	payment: one(payment),
	shipping: one(shipping),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
	order: one(order, {
		fields: [orderItem.orderId],
		references: [order.id],
	}),
	variant: one(variant, {
		fields: [orderItem.variantId],
		references: [variant.id],
	}),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
	order: one(order, {
		fields: [payment.orderId],
		references: [order.id],
	}),
}));

export const shippingRelations = relations(shipping, ({ one }) => ({
	order: one(order, {
		fields: [shipping.orderId],
		references: [order.id],
	}),
}));

export const reviewRelations = relations(review, ({ one }) => ({
	user: one(user, {
		fields: [review.userId],
		references: [user.id],
	}),
	product: one(product, {
		fields: [review.productId],
		references: [product.id],
	}),
}));
