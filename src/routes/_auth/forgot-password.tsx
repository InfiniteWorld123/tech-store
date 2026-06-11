import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "#/components/auth/pages/forgot-password-page";
import {
	AuthRouteError,
	AuthRouteLoading,
} from "#/components/auth/sections/auth-route-states";

export const Route = createFileRoute("/_auth/forgot-password")({
	component: ForgotPasswordPage,
	pendingComponent: AuthRouteLoading,
	errorComponent: ({ error }) => <AuthRouteError error={error as Error} />,
});
