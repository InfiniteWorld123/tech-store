import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailPage } from "#/components/auth/pages/verify-email-page";
import {
	AuthRouteError,
	AuthRouteLoading,
} from "#/components/auth/sections/auth-route-states";

export const Route = createFileRoute("/_auth/verify-email")({
	component: VerifyEmailPage,
	pendingComponent: AuthRouteLoading,
	errorComponent: ({ error }) => <AuthRouteError error={error as Error} />,
});
