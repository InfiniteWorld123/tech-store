import { avg, count, sql } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { payment } from "#/db/schema";
import { handleError } from "#/errors/error-handler";
import type {
	GetPaymentMetricsInputType,
	GetPaymentMetricsOutputType,
} from "../analytics.types";

export const getPaymentMetrics = async (
	_data: GetPaymentMetricsInputType,
): Promise<JsonOk<GetPaymentMetricsOutputType>> => {
	try {
		const [paymentStats] = await db
			.select({
				totalPayments: count(),

				totalCollected: sql<number>`sum(${payment.amount}) filter (where ${payment.status} = 'paid')`,
				totalRefunded: sql<number>`sum(${payment.amount}) filter (where ${payment.status} = 'refunded')`,
				totalPending: sql<number>`sum(${payment.amount}) filter (where ${payment.status} = 'pending')`,
				totalFailed: sql<number>`sum(${payment.amount}) filter (where ${payment.status} = 'failed')`,

				averagePaymentAmount: avg(payment.amount),

				card: sql<number>`count(*) filter (where ${payment.method} = 'card')`,
				paypal: sql<number>`count(*) filter (where ${payment.method} = 'paypal')`,
				bank_transfer: sql<number>`count(*) filter (where ${payment.method} = 'bank_transfer')`,
				cash_on_delivery: sql<number>`count(*) filter (where ${payment.method} = 'cash_on_delivery')`,

				pending: sql<number>`count(*) filter (where ${payment.status} = 'pending')`,
				paid: sql<number>`count(*) filter (where ${payment.status} = 'paid')`,
				failed: sql<number>`count(*) filter (where ${payment.status} = 'failed')`,
				refunded: sql<number>`count(*) filter (where ${payment.status} = 'refunded')`,
			})
			.from(payment);

		return jsonOk({
			status: HttpStatusCode.OK,
			message: "Payment metrics fetched successfully",
			data: {
				totalPayments: Number(paymentStats.totalPayments ?? 0),

				totalCollected: Number(paymentStats.totalCollected ?? 0),
				totalRefunded: Number(paymentStats.totalRefunded ?? 0),
				totalPending: Number(paymentStats.totalPending ?? 0),
				totalFailed: Number(paymentStats.totalFailed ?? 0),

				averagePaymentAmount: Number(paymentStats.averagePaymentAmount ?? 0),

				byMethod: {
					card: paymentStats.card,
					paypal: paymentStats.paypal,
					bank_transfer: paymentStats.bank_transfer,
					cash_on_delivery: paymentStats.cash_on_delivery,
				},
				byStatus: {
					pending: paymentStats.pending,
					paid: paymentStats.paid,
					failed: paymentStats.failed,
					refunded: paymentStats.refunded,
				},
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
