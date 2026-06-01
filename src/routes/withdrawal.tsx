import { createFileRoute } from "@tanstack/react-router";
import { WithdrawalPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/withdrawal")({
	component: WithdrawalPage,
});
