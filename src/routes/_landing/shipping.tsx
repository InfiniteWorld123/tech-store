import { createFileRoute } from "@tanstack/react-router";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";
import { ShippingPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/_landing/shipping")({
	component: ShippingPage,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
