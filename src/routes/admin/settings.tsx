import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "#/components/admin/pages/settings/settings-page.tsx";

export const Route = createFileRoute("/admin/settings")({
	component: SettingsPage,
});
