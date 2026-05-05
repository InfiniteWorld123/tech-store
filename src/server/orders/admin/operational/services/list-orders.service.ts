import type { SQL } from "drizzle-orm";
import {
	and,
	asc,
	countDistinct,
	desc,
	eq,
	gte,
	ilike,
	inArray,
	isNotNull,
	isNull,
	lte,
	or,
	sql,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { HttpStatusCode } from "#/constants/http";
import type { JsonOk } from "#/constants/json";
import { jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order, orderItem, payment, shipping, user } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type { ListOrdersInputType, ListOrdersOutputType } from "../operational.types";

type SearchType = NonNullable<ListOrdersInputType["searching"]>;
type SortType = NonNullable<ListOrdersInputType["sorting"]>;
type FilterType = NonNullable<ListOrdersInputType["filters"]>;
type FlagType = NonNullable<ListOrdersInputType["flags"]>;
type RangeType = NonNullable<ListOrdersInputType["ranges"]>;
type PaginationType = ListOrdersInputType["pagination"];

const orderItemForCount = alias(orderItem, "order_item_for_count");

const buildSearchCondition = (searching: SearchType): SQL | undefined => {
	const { search, searchType } = searching;

	if (!search) {
		return undefined;
	}

	switch (searchType) {
		case "orderNumber":
			return ilike(order.orderNumber, `%${search}%`);
		case "customerName":
			return ilike(user.name, `%${search}%`);
		case "customerEmail":
			return ilike(user.email, `%${search}%`);
		case "sku":
			return ilike(orderItem.sku, `%${search}%`);
		case "productName":
			return ilike(orderItem.productName, `%${search}%`);
		case "trackingNumber":
			return ilike(shipping.trackingNumber, `%${search}%`);
		default:
			return or(
				ilike(order.orderNumber, `%${search}%`),
				ilike(user.name, `%${search}%`),
				ilike(user.email, `%${search}%`),
				ilike(orderItem.sku, `%${search}%`),
				ilike(orderItem.productName, `%${search}%`),
				ilike(shipping.trackingNumber, `%${search}%`),
			);
	}
};

const buildSortCondition = (sorting: SortType) => {
	const { sortBy, sortOrder } = sorting;
	const sortDirection = sortOrder === "asc" ? asc : desc;

	switch (sortBy) {
		case "createdAt":
			return sortDirection(order.createdAt);
		case "placedAt":
			return sortDirection(order.placedAt);
		case "totalAmount":
			return sortDirection(order.totalAmount);
		case "subtotal":
			return sortDirection(order.subtotal);
		case "shippingFee":
			return sortDirection(order.shippingFee);
		case "taxAmount":
			return sortDirection(order.taxAmount);
		case "status":
			return sortDirection(order.status);
		case "customerEmail":
			return sortDirection(user.email);
		case "customerName":
			return sortDirection(user.name);
		case "paymentStatus":
			return sortDirection(payment.status);
		case "paidAt":
			return sortDirection(payment.paidAt);
		case "shippingStatus":
			return sortDirection(shipping.status);
		case "shippedAt":
			return sortDirection(shipping.shippedAt);
		case "deliveredAt":
			return sortDirection(shipping.deliveredAt);
		default:
			return desc(order.placedAt);
	}
};

const buildFilterCondition = (filters: FilterType): SQL[] => {
	const conditions: SQL[] = [];

	if (filters.carriers.length > 0) {
		conditions.push(inArray(shipping.carrier, filters.carriers));
	}

	if (filters.shippingMethods.length > 0) {
		conditions.push(inArray(shipping.method, filters.shippingMethods));
	}

	if (filters.paymentMethods.length > 0) {
		conditions.push(inArray(payment.method, filters.paymentMethods));
	}

	if (filters.paymentStatuses.length > 0) {
		conditions.push(inArray(payment.status, filters.paymentStatuses));
	}

	if (filters.orderStatuses.length > 0) {
		conditions.push(inArray(order.status, filters.orderStatuses));
	}

	if (filters.shippingStatuses.length > 0) {
		conditions.push(inArray(shipping.status, filters.shippingStatuses));
	}

	return conditions;
};

const buildFlagsCondition = (flags: FlagType): SQL[] => {
	const conditions: SQL[] = [];

	if (flags.isCancelled) {
		conditions.push(eq(order.status, "cancelled"));
	}

	if (flags.isPaid) {
		conditions.push(eq(payment.status, "paid"));
	}

	if (flags.isDelivered) {
		conditions.push(eq(shipping.status, "delivered"));
	}

	if (flags.hasNotes) {
		conditions.push(isNotNull(order.notes));
	}

	if (flags.hasTrackingNumber) {
		conditions.push(isNotNull(shipping.trackingNumber));
	}

	if (flags.needsPaymentAttention) {
		const paymentAttentionCondition = or(
			eq(payment.status, "pending"),
			eq(payment.status, "failed"),
		);

		if (paymentAttentionCondition) {
			conditions.push(paymentAttentionCondition);
		}
	}

	if (flags.readyToShip) {
		const readyToShipCondition = and(
			eq(payment.status, "paid"),
			eq(shipping.status, "pending"),
		);

		if (readyToShipCondition) {
			conditions.push(readyToShipCondition);
		}
	}

	return conditions;
};

const buildRangeCondition = (ranges: RangeType): SQL[] => {
	const conditions: SQL[] = [];

	if (ranges.subtotalRange?.min !== undefined) {
		conditions.push(gte(order.subtotal, ranges.subtotalRange.min.toString()));
	}

	if (ranges.subtotalRange?.max !== undefined) {
		conditions.push(lte(order.subtotal, ranges.subtotalRange.max.toString()));
	}

	if (ranges.shippingFeeRange?.min !== undefined) {
		conditions.push(
			gte(order.shippingFee, ranges.shippingFeeRange.min.toString()),
		);
	}

	if (ranges.shippingFeeRange?.max !== undefined) {
		conditions.push(
			lte(order.shippingFee, ranges.shippingFeeRange.max.toString()),
		);
	}

	if (ranges.taxAmountRange?.min !== undefined) {
		conditions.push(gte(order.taxAmount, ranges.taxAmountRange.min.toString()));
	}

	if (ranges.taxAmountRange?.max !== undefined) {
		conditions.push(lte(order.taxAmount, ranges.taxAmountRange.max.toString()));
	}

	if (ranges.totalAmountRange?.min !== undefined) {
		conditions.push(
			gte(order.totalAmount, ranges.totalAmountRange.min.toString()),
		);
	}

	if (ranges.totalAmountRange?.max !== undefined) {
		conditions.push(
			lte(order.totalAmount, ranges.totalAmountRange.max.toString()),
		);
	}

	if (ranges.placedAtRange?.from) {
		conditions.push(gte(order.placedAt, ranges.placedAtRange.from));
	}

	if (ranges.placedAtRange?.to) {
		conditions.push(lte(order.placedAt, ranges.placedAtRange.to));
	}

	if (ranges.createdAtRange?.from) {
		conditions.push(gte(order.createdAt, ranges.createdAtRange.from));
	}

	if (ranges.createdAtRange?.to) {
		conditions.push(lte(order.createdAt, ranges.createdAtRange.to));
	}

	if (ranges.paidAtRange?.from) {
		conditions.push(gte(payment.paidAt, ranges.paidAtRange.from));
	}

	if (ranges.paidAtRange?.to) {
		conditions.push(lte(payment.paidAt, ranges.paidAtRange.to));
	}

	if (ranges.shippedAtRange?.from) {
		conditions.push(gte(shipping.shippedAt, ranges.shippedAtRange.from));
	}

	if (ranges.shippedAtRange?.to) {
		conditions.push(lte(shipping.shippedAt, ranges.shippedAtRange.to));
	}

	if (ranges.deliveredAtRange?.from) {
		conditions.push(gte(shipping.deliveredAt, ranges.deliveredAtRange.from));
	}

	if (ranges.deliveredAtRange?.to) {
		conditions.push(lte(shipping.deliveredAt, ranges.deliveredAtRange.to));
	}

	return conditions;
};

const buildPagination = (pagination: PaginationType) => {
	const { page, limit } = pagination;
	const offset = (page - 1) * limit;

	return {
		page,
		limit,
		offset,
	};
};

export const listOrders = async (
	data: ListOrdersInputType,
): Promise<JsonOk<ListOrdersOutputType>> => {
	try {
		const { searching, sorting, filters, flags, ranges, pagination } = data;
		const conditions: SQL[] = [isNull(order.archivedAt)];

		if (searching) {
			const searchCondition = buildSearchCondition(searching);

			if (searchCondition) {
				conditions.push(searchCondition);
			}
		}

		if (filters) {
			conditions.push(...buildFilterCondition(filters));
		}

		if (flags) {
			conditions.push(...buildFlagsCondition(flags));
		}

		if (ranges) {
			conditions.push(...buildRangeCondition(ranges));
		}

		const orderByClause = sorting
			? buildSortCondition(sorting)
			: desc(order.placedAt);

		const { page, limit, offset } = buildPagination(pagination);
		const whereCondition =
			conditions.length > 0 ? and(...conditions) : undefined;

		const [totalResult] = await db
			.select({
				total: countDistinct(order.id),
			})
			.from(order)
			.innerJoin(user, eq(user.id, order.userId))
			.innerJoin(payment, eq(payment.orderId, order.id))
			.innerJoin(shipping, eq(shipping.orderId, order.id))
			.leftJoin(orderItem, eq(orderItem.orderId, order.id))
			.where(whereCondition);

		const rows = await db
			.select({
				id: order.id,
				userId: order.userId,
				addressId: order.addressId,
				orderNumber: order.orderNumber,
				status: order.status,
				subtotal: order.subtotal,
				shippingFee: order.shippingFee,
				taxAmount: order.taxAmount,
				totalAmount: order.totalAmount,
				notes: order.notes,
				placedAt: order.placedAt,
				createdAt: order.createdAt,
				updatedAt: order.updatedAt,
				customerId: user.id,
				customerName: user.name,
				customerEmail: user.email,
				paymentId: payment.id,
				paymentMethod: payment.method,
				paymentStatus: payment.status,
				paymentAmount: payment.amount,
				paymentPaidAt: payment.paidAt,
				shippingId: shipping.id,
				shippingCarrier: shipping.carrier,
				shippingMethod: shipping.method,
				shippingStatus: shipping.status,
				shippingTrackingNumber: shipping.trackingNumber,
				itemCount: sql<number>`(
        			select count(*)
        			from ${orderItemForCount}
        			where ${orderItemForCount.orderId} = ${order.id}
        		)`.mapWith(Number),
			})
			.from(order)
			.innerJoin(user, eq(user.id, order.userId))
			.innerJoin(payment, eq(payment.orderId, order.id))
			.innerJoin(shipping, eq(shipping.orderId, order.id))
			.leftJoin(orderItem, eq(orderItem.orderId, order.id))
			.where(whereCondition)
			.groupBy(
				order.id,
				order.userId,
				order.addressId,
				order.orderNumber,
				order.status,
				order.subtotal,
				order.shippingFee,
				order.taxAmount,
				order.totalAmount,
				order.notes,
				order.placedAt,
				order.createdAt,
				order.updatedAt,
				user.id,
				user.name,
				user.email,
				payment.id,
				payment.method,
				payment.status,
				payment.amount,
				payment.paidAt,
				shipping.id,
				shipping.carrier,
				shipping.method,
				shipping.status,
				shipping.trackingNumber,
				shipping.shippedAt,
				shipping.deliveredAt,
			)
			.orderBy(orderByClause)
			.limit(limit)
			.offset(offset);

		const items = rows.map((row) => ({
			id: row.id,
			userId: row.userId,
			addressId: row.addressId,
			orderNumber: row.orderNumber,
			status: row.status,
			subtotal: Number(row.subtotal),
			shippingFee: Number(row.shippingFee),
			taxAmount: Number(row.taxAmount),
			totalAmount: Number(row.totalAmount),
			notes: row.notes,
			placedAt: row.placedAt.toISOString(),
			createdAt: row.createdAt.toISOString(),
			updatedAt: row.updatedAt.toISOString(),
			customer: {
				id: row.customerId,
				name: row.customerName,
				email: row.customerEmail,
			},
			payment: {
				id: row.paymentId,
				method: row.paymentMethod,
				status: row.paymentStatus,
				amount: Number(row.paymentAmount),
				paidAt: row.paymentPaidAt?.toISOString() ?? null,
			},
			shipping: {
				id: row.shippingId,
				carrier: row.shippingCarrier,
				method: row.shippingMethod,
				status: row.shippingStatus,
				trackingNumber: row.shippingTrackingNumber,
			},
			itemCount: row.itemCount,
		}));

		const total = totalResult?.total ?? 0;
		const totalPages = Math.ceil(total / limit);

		return jsonOk<ListOrdersOutputType>({
			status: HttpStatusCode.OK,
			message: "Orders fetched successfully",
			data: {
				items,
				query: {
					searching,
					sorting,
					filters,
					flags,
					ranges,
				},
				pagination: {
					page,
					limit,
					total,
					totalPages,
					hasNextPage: page < totalPages,
					hasPreviousPage: page > 1,
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
