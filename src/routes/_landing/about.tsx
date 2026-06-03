import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "#/components/legal/pages/about-page";

export const Route = createFileRoute("/_landing/about")({
	component: AboutPage,
});
