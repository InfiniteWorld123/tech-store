import { createFileRoute } from "@tanstack/react-router";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";
import { WithdrawalPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/_landing/withdrawal")({
	component: WithdrawalPage,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
