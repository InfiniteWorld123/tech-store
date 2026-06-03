import { createFileRoute } from "@tanstack/react-router";
import { WithdrawalPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/_landing/withdrawal")({
	component: WithdrawalPage,
});
