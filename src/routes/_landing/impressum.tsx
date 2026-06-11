import { createFileRoute } from "@tanstack/react-router";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";
import { ImpressumPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/_landing/impressum")({
	component: ImpressumPage,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
