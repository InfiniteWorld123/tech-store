import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SignInPage } from "#/components/auth/pages/sign-in-page";
import {
	AuthRouteError,
	AuthRouteLoading,
} from "#/components/auth/sections/auth-route-states";

export const Route = createFileRoute("/_auth/sign-in")({
	validateSearch: z.object({
		redirect: z.string().optional(),
	}),
	component: SignInPage,
	pendingComponent: AuthRouteLoading,
	errorComponent: ({ error }) => <AuthRouteError error={error as Error} />,
});
