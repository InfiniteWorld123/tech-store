import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/_landing/privacy")({
	component: PrivacyPage,
});
