import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "#/components/auth/pages/sign-up-page";
import {
	AuthRouteError,
	AuthRouteLoading,
} from "#/components/auth/sections/auth-route-states";

export const Route = createFileRoute("/_auth/sign-up")({
	component: SignUpPage,
	pendingComponent: AuthRouteLoading,
	errorComponent: ({ error }) => <AuthRouteError error={error as Error} />,
});
