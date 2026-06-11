import { createFileRoute } from "@tanstack/react-router";
import { PaymentsPage } from "#/components/admin/pages/payments/payments-page.tsx";
import { listPaymentsQueryOptions } from "#/queries/payments.queries";
import { listPaymentsSchema } from "#/server/payments/payments.schemas";

export const Route = createFileRoute("/admin/payments")({
	validateSearch: listPaymentsSchema,
	loaderDeps: ({ search }) => ({
		status: search.status,
		method: search.method,
		search: search.search,
		dateRange: search.dateRange,
		page: search.page,
		limit: search.limit,
		sortBy: search.sortBy,
		sortOrder: search.sortOrder,
	}),
	loader: ({ context, deps }) =>
		context.queryClient.ensureQueryData(listPaymentsQueryOptions(deps)),
	component: PaymentsPage,
	pendingComponent: () => <div></div>,
	errorComponent: () => <div></div>,
});
