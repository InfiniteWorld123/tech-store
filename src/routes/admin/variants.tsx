import { createFileRoute } from "@tanstack/react-router";
import { VariantsPage } from "#/components/admin/pages/variants-page";

export const Route = createFileRoute("/admin/variants")({
	component: VariantsPage,
});
