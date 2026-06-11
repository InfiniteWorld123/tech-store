import { createFileRoute } from "@tanstack/react-router";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";
import { TrackOrderPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/_landing/track")({
	component: TrackOrderPage,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
