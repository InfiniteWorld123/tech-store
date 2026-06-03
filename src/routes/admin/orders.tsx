import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "#/components/admin/pages/orders-page";

export const Route = createFileRoute("/admin/orders")({
	component: OrdersPage,
});
