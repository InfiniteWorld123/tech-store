import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "#/components/catalog/pages/products-page";

export const Route = createFileRoute("/products/")({
	component: ProductsPage,
});
