import { createFileRoute, redirect } from "@tanstack/react-router";
import { CheckoutPage } from "#/components/checkout/pages/checkout-page";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";
import { listAddressesQueryOptions } from "#/queries/addresses.queries";
import { getCartQueryOptions } from "#/queries/cart.queries";
import { getSessionAction } from "#/server/auth/get-session.action";

export const Route = createFileRoute("/checkout")({
	beforeLoad: async ({ location }) => {
		const { user } = await getSessionAction({ data: {} });
		if (!user) {
			throw redirect({
				to: "/sign-in",
				search: { redirect: `${location.pathname}${location.searchStr}` },
			});
		}
	},
	loader: ({ context: { queryClient } }) =>
		Promise.all([
			queryClient.ensureQueryData(getCartQueryOptions).catch(() => null),
			queryClient.ensureQueryData(listAddressesQueryOptions).catch(() => null),
		]),
	component: CheckoutPage,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
