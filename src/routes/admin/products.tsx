import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "#/components/admin/pages/products/products-page.tsx";

export const Route = createFileRoute("/admin/products")({
	component: ProductsPage,
});
