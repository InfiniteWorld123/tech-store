import { createFileRoute } from "@tanstack/react-router";
import { FaqPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/_landing/faq")({
	component: FaqPage,
});
