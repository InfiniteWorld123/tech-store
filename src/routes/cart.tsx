import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "#/components/cart/pages/cart-page";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";
import { getCartQueryOptions } from "#/queries/cart.queries";

export const Route = createFileRoute("/cart")({
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(getCartQueryOptions).catch(() => null),
	component: CartPage,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
