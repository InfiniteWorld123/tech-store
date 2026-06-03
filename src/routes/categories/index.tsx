import { Card } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Card className="m-6 p-8">
			<Card.Header>
				<Card.Title>Categories</Card.Title>
				<Card.Description>
					Category browsing will appear here when the catalog page is connected.
				</Card.Description>
			</Card.Header>
		</Card>
	);
}
