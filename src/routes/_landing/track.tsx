import { createFileRoute } from "@tanstack/react-router";
import { TrackOrderPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/_landing/track")({
	component: TrackOrderPage,
});
