import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "#/components/admin/pages/orders/orders-page.tsx";

export const Route = createFileRoute("/admin/orders")({
	component: OrdersPage,
});
