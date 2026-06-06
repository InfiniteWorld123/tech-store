import { createFileRoute } from "@tanstack/react-router";
import { InventoryPage } from "#/components/admin/pages/inventory/inventory-page.tsx";

export const Route = createFileRoute("/admin/inventory")({
	component: InventoryPage,
});
