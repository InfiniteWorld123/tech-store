import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "#/components/legal/pages/contact-page";

export const Route = createFileRoute("/_landing/contact")({
	component: ContactPage,
});
