import { createFileRoute } from "@tanstack/react-router";
import { CategoriesPage } from "#/components/catalog/pages/categories-page";

export const Route = createFileRoute("/categories/")({
	component: CategoriesPage,
});
