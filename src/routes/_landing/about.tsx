import { createFileRoute } from "@tanstack/react-router";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";
import { AboutPage } from "#/components/legal/pages/about-page";

export const Route = createFileRoute("/_landing/about")({
	component: AboutPage,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
