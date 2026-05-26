import { avg, count, sql, sum } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { order } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	GetOrderMetricsInputType,
	GetOrderMetricsOutputType,
} from "../analytics.types";

export const getOrderMetrics = async (
	_data: GetOrderMetricsInputType,
): Promise<JsonOk<GetOrderMetricsOutputType>> => {
	try {
		const [orderStats] = await db
			.select({
				totalOrders: count(),

				pending: sql<number>`count(*) filter (where ${order.status} = 'pending')`,
				processing: sql<number>`count(*) filter (where ${order.status} = 'processing')`,
				completed: sql<number>`count(*) filter (where ${order.status} = 'completed')`,
				cancelled: sql<number>`count(*) filter (where ${order.status} = 'cancelled')`,

				totalRevenue: sum(order.totalAmount),
				averageOrderValue: avg(order.totalAmount),

				activeOrders: sql<number>`count(*) filter (where ${order.archivedAt} is null)`,
				archivedOrders: sql<number>`count(*) filter (where ${order.archivedAt} is not null)`,
			})
			.from(order);

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Order metrics fetched successfully",
			data: {
				overview: {
					totalOrders: orderStats.totalOrders,
					totalRevenue: Number(orderStats.totalRevenue ?? 0),
					averageOrderValue: Number(orderStats.averageOrderValue ?? 0),
					activeOrders: orderStats.activeOrders,
					archivedOrders: orderStats.archivedOrders,
				},
				byStatus: {
					pending: orderStats.pending,
					processing: orderStats.processing,
					completed: orderStats.completed,
					cancelled: orderStats.cancelled,
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
