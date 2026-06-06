import { createFileRoute } from "@tanstack/react-router";
import { VariantsPage } from "#/components/admin/pages/variants/variants-page.tsx";

export const Route = createFileRoute("/admin/variants")({
	component: VariantsPage,
});
