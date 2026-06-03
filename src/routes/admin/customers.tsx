import { createFileRoute } from "@tanstack/react-router";
import { CustomersPage } from "#/components/admin/pages/customers-page";

export const Route = createFileRoute("/admin/customers")({
	component: CustomersPage,
});
