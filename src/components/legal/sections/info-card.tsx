import { Card } from "@heroui/react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type InfoCardProps = {
	icon?: LucideIcon;
	title: string;
	description?: string;
	children?: ReactNode;
	className?: string;
};

export function InfoCard({
	icon: Icon,
	title,
	description,
	children,
	className,
}: InfoCardProps) {
	return (
		<Card className={["p-6 shadow-sm", className].filter(Boolean).join(" ")}>
			{Icon ? (
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
					<Icon size={22} />
				</div>
			) : null}
			<Card.Header>
				<Card.Title className="text-lg">{title}</Card.Title>
				{description ? (
					<Card.Description className="leading-relaxed">
						{description}
					</Card.Description>
				) : null}
			</Card.Header>
			{children ? (
				<Card.Content className="mt-4 p-0">{children}</Card.Content>
			) : null}
		</Card>
	);
}

export function PolicySection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<Card className="p-6 sm:p-8">
			<Card.Header>
				<Card.Title className="text-xl">{title}</Card.Title>
			</Card.Header>
			<Card.Content className="mt-4 space-y-3 p-0 text-muted leading-relaxed">
				{children}
			</Card.Content>
		</Card>
	);
}
