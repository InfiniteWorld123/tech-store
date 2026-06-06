import { createFileRoute } from "@tanstack/react-router";
import { CategoriesPage } from "#/components/admin/pages/categories/categories-page.tsx";

export const Route = createFileRoute("/admin/categories")({
	component: CategoriesPage,
});
