import { createFileRoute } from "@tanstack/react-router";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";
import { PrivacyPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/_landing/privacy")({
	component: PrivacyPage,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
