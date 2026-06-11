import { and, asc, count, desc, eq, gte, ilike, lte } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order, shipping } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	ListShipmentsInputType,
	ListShipmentsOutputType,
} from "../shipping.types";

export async function listShipments(
	data: ListShipmentsInputType,
): Promise<JsonOk<ListShipmentsOutputType>> {
	try {
		const {
			status,
			carrier,
			method,
			search,
			dateRange,
			page,
			limit,
			sortBy,
			sortOrder,
		} = data;
		const offset = (page - 1) * limit;

		const conditions = [
			status ? eq(shipping.status, status) : undefined,
			carrier ? eq(shipping.carrier, carrier) : undefined,
			method ? eq(shipping.method, method) : undefined,
			search ? ilike(order.orderNumber, `%${search}%`) : undefined,
			dateRange?.from
				? gte(shipping.createdAt, new Date(dateRange.from))
				: undefined,
			dateRange?.to
				? lte(shipping.createdAt, new Date(dateRange.to))
				: undefined,
		].filter((c) => c !== undefined);

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		const sortCol =
			sortBy === "shippedAt"
				? shipping.shippedAt
				: sortBy === "deliveredAt"
					? shipping.deliveredAt
					: shipping.createdAt;
		const sortFn = sortOrder === "asc" ? asc : desc;

		const [totalRow] = await db
			.select({ total: count(shipping.id) })
			.from(shipping)
			.innerJoin(order, eq(order.id, shipping.orderId))
			.where(whereClause);

		const rows = await db
			.select({
				id: shipping.id,
				orderId: shipping.orderId,
				orderNumber: order.orderNumber,
				carrier: shipping.carrier,
				method: shipping.method,
				trackingNumber: shipping.trackingNumber,
				status: shipping.status,
				shippedAt: shipping.shippedAt,
				deliveredAt: shipping.deliveredAt,
				createdAt: shipping.createdAt,
				updatedAt: shipping.updatedAt,
			})
			.from(shipping)
			.innerJoin(order, eq(order.id, shipping.orderId))
			.where(whereClause)
			.orderBy(sortFn(sortCol))
			.limit(limit)
			.offset(offset);

		const total = totalRow.total;
		const totalPages = Math.ceil(total / limit);

		return jsonOk<ListShipmentsOutputType>({
			status: HttpStatusCode.OK,
			message: "Shipments fetched successfully",
			data: {
				items: rows.map((row) => ({
					id: row.id,
					orderId: row.orderId,
					orderNumber: row.orderNumber,
					carrier: row.carrier,
					method: row.method,
					trackingNumber: row.trackingNumber ?? null,
					status: row.status,
					shippedAt: row.shippedAt?.toISOString() ?? null,
					deliveredAt: row.deliveredAt?.toISOString() ?? null,
					createdAt: row.createdAt.toISOString(),
					updatedAt: row.updatedAt.toISOString(),
				})),
				pagination: {
					page,
					limit,
					total,
					totalPages,
					hasNextPage: page < totalPages,
					hasPreviousPage: page > 1,
				},
				query: {
					status,
					carrier,
					method,
					search,
					dateRange,
					sortBy,
					sortOrder,
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
}
