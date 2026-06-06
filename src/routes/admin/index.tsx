import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "#/components/admin/pages/dashboard/dashboard-page.tsx";

export const Route = createFileRoute("/admin/")({ component: DashboardPage });
