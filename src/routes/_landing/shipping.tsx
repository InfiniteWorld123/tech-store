import { createFileRoute } from "@tanstack/react-router";
import { ShippingPage } from "#/components/legal/pages/support-pages";

export const Route = createFileRoute("/_landing/shipping")({
	component: ShippingPage,
});
