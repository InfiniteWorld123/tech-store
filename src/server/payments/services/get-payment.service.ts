import { eq } from "drizzle-orm";
import { HttpStatusCode } from "#/constants/http";
import { type JsonOk, jsonOk } from "#/constants/json";
import { db } from "#/db/drizzle";
import { payment, stripePayment } from "#/db/schema";
import { notFoundError } from "#/errors/app-error";
import { handleError } from "#/errors/error-handler";
import type {
	GetPaymentInputType,
	GetPaymentOutputType,
	PaymentType,
} from "../payments.types";

type PaymentRow = {
	paymentId: string;
	orderId: string;
	method: PaymentType["method"];
	amount: string;
	status: PaymentType["status"];
	paidAt: Date | null;
	paymentCreatedAt: Date;
	paymentUpdatedAt: Date;
	stripePaymentId: string | null;
	checkoutSessionId: string | null;
	paymentIntentId: string | null;
	customerId: string | null;
	currency: string | null;
	checkoutUrl: string | null;
	stripeStatus: string | null;
	stripeCreatedAt: Date | null;
	stripeUpdatedAt: Date | null;
};

export const mapPayment = (row: PaymentRow): PaymentType => ({
	id: row.paymentId,
	orderId: row.orderId,
	method: row.method,
	amount: Number(row.amount),
	status: row.status,
	paidAt: row.paidAt?.toISOString() ?? null,
	createdAt: row.paymentCreatedAt.toISOString(),
	updatedAt: row.paymentUpdatedAt.toISOString(),
	stripe:
		row.stripePaymentId &&
		row.checkoutSessionId &&
		row.currency &&
		row.stripeStatus
			? {
					id: row.stripePaymentId,
					checkoutSessionId: row.checkoutSessionId,
					paymentIntentId: row.paymentIntentId,
					customerId: row.customerId,
					currency: row.currency,
					checkoutUrl: row.checkoutUrl,
					status: row.stripeStatus,
					createdAt: row.stripeCreatedAt?.toISOString() ?? "",
					updatedAt: row.stripeUpdatedAt?.toISOString() ?? "",
				}
			: null,
});

export const getPayment = async (
	data: GetPaymentInputType,
): Promise<JsonOk<GetPaymentOutputType>> => {
	try {
		const [row] = await db
			.select({
				paymentId: payment.id,
				orderId: payment.orderId,
				method: payment.method,
				amount: payment.amount,
				status: payment.status,
				paidAt: payment.paidAt,
				paymentCreatedAt: payment.createdAt,
				paymentUpdatedAt: payment.updatedAt,
				stripePaymentId: stripePayment.id,
				checkoutSessionId: stripePayment.checkoutSessionId,
				paymentIntentId: stripePayment.paymentIntentId,
				customerId: stripePayment.customerId,
				currency: stripePayment.currency,
				checkoutUrl: stripePayment.checkoutUrl,
				stripeStatus: stripePayment.status,
				stripeCreatedAt: stripePayment.createdAt,
				stripeUpdatedAt: stripePayment.updatedAt,
			})
			.from(payment)
			.leftJoin(stripePayment, eq(stripePayment.paymentId, payment.id))
			.where(eq(payment.orderId, data.orderId));

		if (!row) {
			throw notFoundError("Payment not found");
		}

		return jsonOk<GetPaymentOutputType>({
			status: HttpStatusCode.OK,
			message: "Payment fetched successfully",
			data: {
				payment: mapPayment(row),
			},
		});
	} catch (error) {
		throw handleError(error);
	}
};
