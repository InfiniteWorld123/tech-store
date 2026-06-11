import { and, asc, count, desc, eq, gte, ilike, lte } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order, payment, stripePayment } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	ListPaymentsInputType,
	ListPaymentsOutputType,
} from "../payments.types";

export const listPayments = async (
	data: ListPaymentsInputType,
): Promise<JsonOk<ListPaymentsOutputType>> => {
	try {
		const {
			status,
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
			status ? eq(payment.status, status) : undefined,
			method ? eq(payment.method, method) : undefined,
			search ? ilike(order.orderNumber, `%${search}%`) : undefined,
			dateRange?.from
				? gte(payment.createdAt, new Date(dateRange.from))
				: undefined,
			dateRange?.to
				? lte(payment.createdAt, new Date(dateRange.to))
				: undefined,
		].filter((c) => c !== undefined);

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		const sortCol =
			sortBy === "amount"
				? payment.amount
				: sortBy === "paidAt"
					? payment.paidAt
					: payment.createdAt;
		const sortFn = sortOrder === "asc" ? asc : desc;

		const [totalRow] = await db
			.select({ total: count(payment.id) })
			.from(payment)
			.innerJoin(order, eq(order.id, payment.orderId))
			.where(whereClause);

		const rows = await db
			.select({
				id: payment.id,
				orderId: payment.orderId,
				orderNumber: order.orderNumber,
				method: payment.method,
				amount: payment.amount,
				status: payment.status,
				paidAt: payment.paidAt,
				createdAt: payment.createdAt,
				updatedAt: payment.updatedAt,
				currency: stripePayment.currency,
			})
			.from(payment)
			.innerJoin(order, eq(order.id, payment.orderId))
			.leftJoin(stripePayment, eq(stripePayment.paymentId, payment.id))
			.where(whereClause)
			.orderBy(sortFn(sortCol))
			.limit(limit)
			.offset(offset);

		const total = totalRow.total;
		const totalPages = Math.ceil(total / limit);

		return jsonOk<ListPaymentsOutputType>({
			status: HttpStatusCode.OK,
			message: "Payments fetched successfully",
			data: {
				items: rows.map((row) => ({
					id: row.id,
					orderId: row.orderId,
					orderNumber: row.orderNumber,
					method: row.method,
					amount: Number(row.amount),
					status: row.status,
					currency: row.currency ?? null,
					paidAt: row.paidAt?.toISOString() ?? null,
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
};
