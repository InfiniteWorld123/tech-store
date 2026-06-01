import { createFileRoute } from "@tanstack/react-router";
import { TrackOrderPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/track")({
	component: TrackOrderPage,
});
