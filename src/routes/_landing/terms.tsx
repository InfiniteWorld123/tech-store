import { createFileRoute } from "@tanstack/react-router";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";
import { TermsPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/_landing/terms")({
	component: TermsPage,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
