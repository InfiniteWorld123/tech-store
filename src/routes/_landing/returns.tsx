import { createFileRoute } from "@tanstack/react-router";
import { ReturnsPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/_landing/returns")({
	component: ReturnsPage,
});
