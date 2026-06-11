import { createFileRoute } from "@tanstack/react-router";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";
import { ContactPage } from "#/components/legal/pages/contact-page";

export const Route = createFileRoute("/_landing/contact")({
	component: ContactPage,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
