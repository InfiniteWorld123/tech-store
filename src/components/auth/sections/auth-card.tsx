import { Card } from "@heroui/react";
import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export function AuthCard({ children }: Props) {
	return (
		<Card className="w-full max-w-[440px] shadow-md">
			<Card.Content className="flex flex-col gap-6 p-8">{children}</Card.Content>
		</Card>
	);
}
