import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["customer", "admin"]);

export const orderStatusEnum = pgEnum("order_status", [
	"pending",
	"processing",
	"completed",
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
