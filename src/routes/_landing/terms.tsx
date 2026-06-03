import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/_landing/terms")({
	component: TermsPage,
});
