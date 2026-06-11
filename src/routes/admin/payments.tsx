import { createFileRoute } from "@tanstack/react-router";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { PaymentsPage } from "#/components/admin/pages/payments/payments-page.tsx";
import { listPaymentsQueryOptions } from "#/queries/payments.queries";
import { listPaymentsSchema } from "#/server/payments/payments.schemas";

export const Route = createFileRoute("/admin/payments")({
	validateSearch: listPaymentsSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) =>
		context.queryClient.ensureQueryData(listPaymentsQueryOptions(deps)),
	component: PaymentsPage,
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
