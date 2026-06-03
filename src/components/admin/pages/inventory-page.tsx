import { Card, Tabs } from "@heroui/react";
import { AdminPageHeader } from "#/components/admin/sections/admin-page";

export function InventoryPage() {
	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader
				title="Inventory"
				description="Manage product options and variant attributes"
			/>
			<Tabs defaultSelectedKey="colors">
				<Tabs.List>
					<Tabs.Tab id="colors">Colors</Tabs.Tab>
					<Tabs.Tab id="ram">RAM</Tabs.Tab>
					<Tabs.Tab id="storage">Storage</Tabs.Tab>
					<Tabs.Tab id="screens">Screen Sizes</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel id="colors">
					<EmptyTabContent label="No colors defined yet." />
				</Tabs.Panel>
				<Tabs.Panel id="ram">
					<EmptyTabContent label="No RAM options defined yet." />
				</Tabs.Panel>
				<Tabs.Panel id="storage">
					<EmptyTabContent label="No storage options defined yet." />
				</Tabs.Panel>
				<Tabs.Panel id="screens">
					<EmptyTabContent label="No screen sizes defined yet." />
				</Tabs.Panel>
			</Tabs>
		</div>
	);
}

function EmptyTabContent({ label }: { label: string }) {
	return (
		<Card className="mt-4 items-center justify-center p-10">
			<Card.Content className="p-0">
				<p className="text-sm text-muted">{label}</p>
			</Card.Content>
		</Card>
	);
}
