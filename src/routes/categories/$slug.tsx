import { Card } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories/$slug")({
	component: RouteComponent,
});

function RouteComponent() {
	const { slug } = Route.useParams();

	return (
		<Card className="m-6 p-8">
			<Card.Header>
				<Card.Title>{slug}</Card.Title>
				<Card.Description>
					Products for this category will appear here when the catalog page is
					connected.
				</Card.Description>
			</Card.Header>
		</Card>
	);
}
