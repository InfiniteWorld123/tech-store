import { Alert } from "@heroui/react";

type Props = {
	message: string;
	status?: "danger" | "success" | "warning" | "accent" | "default";
};

export function AuthAlert({ message, status = "danger" }: Props) {
	return (
		<Alert status={status}>
			<Alert.Indicator />
			<Alert.Content>
				<Alert.Title>{message}</Alert.Title>
			</Alert.Content>
		</Alert>
	);
}
