import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { OrderDetailPage } from "#/components/account/pages/order-detail-page";
import { getCustomerOrderDetailQueryOptions } from "#/queries/orders.queries";

const searchSchema = z.object({
	paid: z.boolean().optional(),
});

export const Route = createFileRoute("/account/orders/$orderId")({
	validateSearch: searchSchema,
	loader: ({ context: { queryClient }, params: { orderId } }) =>
		queryClient
			.ensureQueryData(getCustomerOrderDetailQueryOptions({ orderId }))
			.catch(() => null),
	component: OrderDetailPage,
});
