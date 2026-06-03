import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "#/components/admin/pages/settings-page";

export const Route = createFileRoute("/admin/settings")({
	component: SettingsPage,
});
