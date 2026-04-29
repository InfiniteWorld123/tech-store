import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
};

const uuidId = () => uuid("id").defaultRandom().primaryKey();

export const orderStatusEnum = pgEnum("order_status", [
	"pending",
	"processing",
	"shipped",
	"delivered",
	"cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
	"pending",
	"paid",
	"failed",
	"refunded",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
	"card",
	"paypal",
	"bank_transfer",
	"cash_on_delivery",
]);

export const shippingStatusEnum = pgEnum("shipping_status", [
	"pending",
	"packed",
	"shipped",
	"in_transit",
	"delivered",
]);

export const shippingMethodEnum = pgEnum("shipping_method", [
	"standard",
	"express",
	"same_day",
]);

export const shippingCarrierEnum = pgEnum("shipping_carrier", [
	"dhl",
	"hermes",
	"ups",
	"fedex",
]);

// Better Auth tables
export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	...timestamps,
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		...timestamps,
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

// Catalog tables
export const category = pgTable(
	"category",
	{
		id: uuidId(),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		image: text("image"),
		...timestamps,
	},
	(table) => [unique("category_slug_unique").on(table.slug)],
);

export const color = pgTable("color", {
	id: uuidId(),
	name: text("name").notNull(),
	hexCode: text("hex_code"),
	...timestamps,
});

export const storage = pgTable("storage", {
	id: uuidId(),
	name: text("name").notNull(),
	valueGb: integer("value_gb").notNull(),
	...timestamps,
});

export const ram = pgTable("ram", {
	id: uuidId(),
	name: text("name").notNull(),
	valueGb: integer("value_gb").notNull(),
	...timestamps,
});

export const screenSize = pgTable("screen_size", {
	id: uuidId(),
	name: text("name").notNull(),
	valueInches: numeric("value_inches", { precision: 4, scale: 1 }).notNull(),
	...timestamps,
});

export const product = pgTable(
	"product",
	{
		id: uuidId(),
		categoryId: uuid("category_id")
			.notNull()
			.references(() => category.id, { onDelete: "restrict" }),
		name: text("name").notNull(),
		brand: text("brand").notNull(),
		slug: text("slug").notNull(),
		shortDescription: text("short_description"),
		description: text("description").notNull(),
		warrantyInfo: text("warranty_info"),
		image: text("image"),
		ratingAvg: numeric("rating_avg", { precision: 2, scale: 1 })
			.default("0.0")
			.notNull(),
		reviewsCount: integer("reviews_count").default(0).notNull(),
		isFeatured: boolean("is_featured").default(false).notNull(),
		isBestseller: boolean("is_bestseller").default(false).notNull(),
		isActive: boolean("is_active").default(true).notNull(),
		...timestamps,
	},
	(table) => [
		unique("product_slug_unique").on(table.slug),
		index("product_category_id_idx").on(table.categoryId),
	],
);

export const variant = pgTable(
	"variant",
	{
		id: uuidId(),
		productId: uuid("product_id")
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		sku: text("sku").notNull(),
		price: numeric("price", { precision: 10, scale: 2 }).notNull(),
		compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
		stockQuantity: integer("stock_quantity").default(0).notNull(),
		colorId: uuid("color_id").references(() => color.id, {
			onDelete: "set null",
		}),
		storageId: uuid("storage_id").references(() => storage.id, {
			onDelete: "set null",
		}),
		ramId: uuid("ram_id").references(() => ram.id, { onDelete: "set null" }),
		screenSizeId: uuid("screen_size_id").references(() => screenSize.id, {
			onDelete: "set null",
		}),
		isDefault: boolean("is_default").default(false).notNull(),
		...timestamps,
	},
	(table) => [
		unique("variant_sku_unique").on(table.sku),
		index("variant_product_id_idx").on(table.productId),
		index("variant_color_id_idx").on(table.colorId),
		index("variant_storage_id_idx").on(table.storageId),
		index("variant_ram_id_idx").on(table.ramId),
		index("variant_screen_size_id_idx").on(table.screenSizeId),
	],
);

export const variantImage = pgTable(
	"variant_image",
	{
		id: uuidId(),
		variantId: uuid("variant_id")
			.notNull()
			.references(() => variant.id, { onDelete: "cascade" }),
		image: text("image").notNull(),
		sortOrder: integer("sort_order").default(0).notNull(),
		...timestamps,
	},
	(table) => [
		index("variant_image_variant_id_idx").on(table.variantId),
		index("variant_image_sort_order_idx").on(table.sortOrder),
	],
);

// Customer tables
export const address = pgTable(
	"address",
	{
		id: uuidId(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		fullName: text("full_name").notNull(),
		phone: text("phone").notNull(),
		street: text("street").notNull(),
		postalCode: text("postal_code").notNull(),
		city: text("city").notNull(),
		state: text("state"),
		country: text("country").notNull(),
		isDefault: boolean("is_default").default(false).notNull(),
		...timestamps,
	},
	(table) => [index("address_user_id_idx").on(table.userId)],
);

export const cart = pgTable(
	"cart",
	{
		id: uuidId(),
		userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
		sessionId: text("session_id"),
		...timestamps,
	},
	(table) => [index("cart_user_id_idx").on(table.userId)],
);

export const cartItem = pgTable(
	"cart_item",
	{
		id: uuidId(),
		cartId: uuid("cart_id")
			.notNull()
			.references(() => cart.id, { onDelete: "cascade" }),
		variantId: uuid("variant_id")
			.notNull()
			.references(() => variant.id, { onDelete: "restrict" }),
		quantity: integer("quantity").default(1).notNull(),
		priceAtTime: numeric("price_at_time", {
			precision: 10,
			scale: 2,
		}).notNull(),
		...timestamps,
	},
	(table) => [
		index("cart_item_cart_id_idx").on(table.cartId),
		index("cart_item_variant_id_idx").on(table.variantId),
	],
);

// Order and checkout tables
export const order = pgTable(
	"order",
	{
		id: uuidId(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "restrict" }),
		addressId: uuid("address_id")
			.notNull()
			.references(() => address.id, { onDelete: "restrict" }),
		orderNumber: text("order_number").notNull(),
		status: orderStatusEnum("status").notNull(),
		subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
		shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 })
			.default("0.00")
			.notNull(),
		taxAmount: numeric("tax_amount", { precision: 10, scale: 2 })
			.default("0.00")
			.notNull(),
		totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
		notes: text("notes"),
		placedAt: timestamp("placed_at").defaultNow().notNull(),
		...timestamps,
	},
	(table) => [
		unique("order_order_number_unique").on(table.orderNumber),
		index("order_user_id_idx").on(table.userId),
		index("order_address_id_idx").on(table.addressId),
	],
);

export const orderItem = pgTable(
	"order_item",
	{
		id: uuidId(),
		orderId: uuid("order_id")
			.notNull()
			.references(() => order.id, { onDelete: "cascade" }),
		variantId: uuid("variant_id")
			.notNull()
			.references(() => variant.id, { onDelete: "restrict" }),
		productName: text("product_name").notNull(),
		variantName: text("variant_name").notNull(),
		sku: text("sku").notNull(),
		quantity: integer("quantity").notNull(),
		unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
		totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
	},
	(table) => [
		index("order_item_order_id_idx").on(table.orderId),
		index("order_item_variant_id_idx").on(table.variantId),
	],
);

export const payment = pgTable(
	"payment",
	{
		id: uuidId(),
		orderId: uuid("order_id")
			.notNull()
			.references(() => order.id, { onDelete: "cascade" }),
		method: paymentMethodEnum("method").notNull(),
		amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
		status: paymentStatusEnum("status").notNull(),
		paidAt: timestamp("paid_at"),
		...timestamps,
	},
	(table) => [unique("payment_order_id_unique").on(table.orderId)],
);

export const shipping = pgTable(
	"shipping",
	{
		id: uuidId(),
		orderId: uuid("order_id")
			.notNull()
			.references(() => order.id, { onDelete: "cascade" }),
		carrier: shippingCarrierEnum("carrier").notNull(),
		method: shippingMethodEnum("method").notNull(),
		trackingNumber: text("tracking_number"),
		status: shippingStatusEnum("status").notNull(),
		shippedAt: timestamp("shipped_at"),
		deliveredAt: timestamp("delivered_at"),
		...timestamps,
	},
	(table) => [unique("shipping_order_id_unique").on(table.orderId)],
);

// Review tables
export const review = pgTable(
	"review",
	{
		id: uuidId(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		productId: uuid("product_id")
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
		title: text("title").notNull(),
		comment: text("comment").notNull(),
		...timestamps,
	},
	(table) => [
		unique("review_user_product_unique").on(table.userId, table.productId),
		index("review_product_id_idx").on(table.productId),
	],
);

// Relations
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
