import { z } from "zod";

export const orderStatusSchema = z.enum([
	"pending",
	"processing",
	"shipped",
	"delivered",
	"cancelled",
]);

export const paymentStatusSchema = z.enum([
	"pending",
	"paid",
	"failed",
	"refunded",
]);

export const paymentMethodSchema = z.enum([
	"card",
	"paypal",
	"bank_transfer",
	"cash_on_delivery",
]);

export const shippingStatusSchema = z.enum([
	"pending",
	"packed",
	"shipped",
	"in_transit",
	"delivered",
]);

export const shippingMethodSchema = z.enum(["standard", "express", "same_day"]);

export const shippingCarrierSchema = z.enum(["dhl", "hermes", "ups", "fedex"]);

export const orderSearchTypeSchema = z.enum([
	"orderNumber",
	"customerName",
	"customerEmail",
	"sku",
	"productName",
	"trackingNumber",
]);

export const orderSortBySchema = z.enum([
	"createdAt",
	"placedAt",
	"totalAmount",
	"subtotal",
	"shippingFee",
	"taxAmount",
	"paidAt",
	"shippedAt",
	"deliveredAt",
	"status",
	"paymentStatus",
	"shippingStatus",
	"customerName",
	"customerEmail",
]);

export const orderSortOrderSchema = z.enum(["asc", "desc"]);

export const amountRangeSchema = z
	.object({
		min: z.number().nonnegative().optional(),
		max: z.number().nonnegative().optional(),
	})
	.refine(
		(value) =>
			value.min === undefined ||
			value.max === undefined ||
			value.min <= value.max,
		{
			message: "Minimum amount cannot be greater than maximum amount",
			path: ["max"],
		},
	);

export const dateRangeSchema = z
	.object({
		from: z.coerce.date().optional(),
		to: z.coerce.date().optional(),
	})
	.refine(
		(value) =>
			value.from === undefined ||
			value.to === undefined ||
			value.from <= value.to,
		{
			message: "Start date cannot be after end date",
			path: ["to"],
		},
	);

export const getAllOrdersValidationSchema = z.object({
	searching: z
		.object({
			search: z.string().trim().min(1, "Search term is required").optional(),
			searchType: orderSearchTypeSchema.optional(),
		})
		.optional(),

	sorting: z
		.object({
			sortBy: orderSortBySchema.default("placedAt"),
			sortOrder: orderSortOrderSchema.default("desc"),
		})
		.optional(),

	filters: z
		.object({
			orderStatuses: z.array(orderStatusSchema).default([]),
			paymentStatuses: z.array(paymentStatusSchema).default([]),
			shippingStatuses: z.array(shippingStatusSchema).default([]),
			paymentMethods: z.array(paymentMethodSchema).default([]),
			shippingMethods: z.array(shippingMethodSchema).default([]),
			carriers: z.array(shippingCarrierSchema).default([]),
		})
		.optional(),

	flags: z
		.object({
			readyToShip: z.boolean().optional(),
			needsPaymentAttention: z.boolean().optional(),
			hasTrackingNumber: z.boolean().optional(),
			hasNotes: z.boolean().optional(),
			isPaid: z.boolean().optional(),
			isDelivered: z.boolean().optional(),
			isCancelled: z.boolean().optional(),
		})
		.optional(),

	ranges: z
		.object({
			subtotalRange: amountRangeSchema.optional(),
			shippingFeeRange: amountRangeSchema.optional(),
			taxAmountRange: amountRangeSchema.optional(),
			totalAmountRange: amountRangeSchema.optional(),
			placedAtRange: dateRangeSchema.optional(),
			createdAtRange: dateRangeSchema.optional(),
			paidAtRange: dateRangeSchema.optional(),
			shippedAtRange: dateRangeSchema.optional(),
			deliveredAtRange: dateRangeSchema.optional(),
		})
		.optional(),

	pagination: z.object({
		page: z.number().int().min(1).default(1),
		limit: z
			.number()
			.int()
			.min(1, "Limit must be at least 1")
			.max(100, "Limit cannot be greater than 100")
			.default(10),
	}),
});
