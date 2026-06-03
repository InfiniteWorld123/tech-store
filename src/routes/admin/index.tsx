import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "#/components/admin/pages/dashboard-page";

export const Route = createFileRoute("/admin/")({ component: DashboardPage });
