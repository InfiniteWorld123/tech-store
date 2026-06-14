import { createFileRoute, redirect } from "@tanstack/react-router";
import { AccountLayout } from "#/components/account/layout/account-layout";
import {
	PublicRouteError,
	PublicRouteLoading,
} from "#/components/layout/public-route-states";
import { getSessionAction } from "#/server/auth/get-session.action";

export const Route = createFileRoute("/account")({
	beforeLoad: async ({ location }) => {
		const { user } = await getSessionAction({ data: {} });
		if (!user) {
			throw redirect({
				to: "/sign-in",
				search: { redirect: `${location.pathname}${location.searchStr}` },
			});
		}
	},
	component: AccountLayout,
	pendingComponent: PublicRouteLoading,
	errorComponent: ({ error }) => <PublicRouteError error={error as Error} />,
});
