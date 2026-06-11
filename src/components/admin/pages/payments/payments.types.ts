import type { ListPaymentsOutputType } from "#/server/payments/payments.types";

export type PaymentListItem = ListPaymentsOutputType["items"][number];
export type PaymentStatus = PaymentListItem["status"];
export type PaymentMethod = PaymentListItem["method"];
