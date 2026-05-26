import {
	index,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { variant } from "./catalog";
import { address } from "./customers";
import {
	orderStatusEnum,
	paymentMethodEnum,
	paymentStatusEnum,
	shippingCarrierEnum,
	shippingMethodEnum,
	shippingStatusEnum,
} from "./enums";
import { timestamps, uuidId } from "./shared";

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
		archivedAt: timestamp("archived_at"),
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

export const stripePayment = pgTable(
	"stripe_payment",
	{
		id: uuidId(),
		paymentId: uuid("payment_id")
			.notNull()
			.references(() => payment.id, { onDelete: "cascade" }),
		checkoutSessionId: text("checkout_session_id").notNull(),
		paymentIntentId: text("payment_intent_id"),
		customerId: text("customer_id"),
		currency: text("currency").notNull(),
		checkoutUrl: text("checkout_url"),
		status: text("status").notNull(),
		...timestamps,
	},
	(table) => [
		unique("stripe_payment_payment_id_unique").on(table.paymentId),
		unique("stripe_payment_checkout_session_id_unique").on(
			table.checkoutSessionId,
		),
	],
);
