import { createFileRoute } from "@tanstack/react-router";
import { ImpressumPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/impressum")({
	component: ImpressumPage,
});
