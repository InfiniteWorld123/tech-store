import { Card } from "@heroui/react";
import { AdminPageHeader } from "#/components/admin/sections/admin-page";

const SETTINGS_SECTIONS = [
	{
		title: "General",
		description: "Store name, timezone, and currency settings",
	},
	{
		title: "Account",
		description: "Admin credentials and profile information",
	},
	{
		title: "Notifications",
		description: "Email and system alert preferences",
	},
];

export function SettingsPage() {
	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader
				title="Settings"
				description="Manage your store configuration"
			/>
			<div className="flex flex-col gap-4 max-w-2xl">
				{SETTINGS_SECTIONS.map((section) => (
					<Card key={section.title}>
						<Card.Header>
							<Card.Title className="text-base">{section.title}</Card.Title>
							<Card.Description>{section.description}</Card.Description>
						</Card.Header>
						<Card.Content>
							<p className="text-sm text-muted">Coming soon.</p>
						</Card.Content>
					</Card>
				))}
			</div>
		</div>
	);
}
