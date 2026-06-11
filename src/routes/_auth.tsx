import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
	AuthRouteError,
	AuthRouteLoading,
} from "#/components/auth/sections/auth-route-states";

export const Route = createFileRoute("/_auth")({
	component: AuthLayout,
	pendingComponent: AuthRouteLoading,
	errorComponent: ({ error }) => <AuthRouteError error={error as Error} />,
});

function AuthLayout() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Outlet />
		</div>
	);
}
