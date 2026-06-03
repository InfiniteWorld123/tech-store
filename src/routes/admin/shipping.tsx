import { createFileRoute } from "@tanstack/react-router";
import { ShippingPage } from "#/components/admin/pages/shipping-page";

export const Route = createFileRoute("/admin/shipping")({
	component: ShippingPage,
});
