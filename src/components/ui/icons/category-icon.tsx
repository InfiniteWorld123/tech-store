import type { LucideProps } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Tags } from "lucide-react";
import type { ComponentType } from "react";

// Renders a lucide icon by its PascalCase string name (e.g. "Laptop", "Smartphone").
// Falls back to <Tags> if the name is null or not a valid lucide icon.
export function DynamicIcon({
	name,
	...props
}: Omit<LucideProps, "name"> & { name: string | null }) {
	if (name) {
		const Icon = (LucideIcons as Record<string, unknown>)[name];
		if (typeof Icon === "function") {
			const Component = Icon as ComponentType<LucideProps>;
			return <Component {...props} />;
		}
	}
	return <Tags {...props} />;
}

// The coloured square used in the table and modal previews.
export function CategoryIconDisplay({
	icon,
	iconColor,
	iconBg,
	name,
	iconSize = 16,
	className = "size-9",
}: {
	icon: string | null;
	iconColor: string | null;
	iconBg: string | null;
	name: string;
	iconSize?: number;
	className?: string;
}) {
	return (
		<div
			className={`${className} rounded-xl flex items-center justify-center shrink-0`}
			style={{
				backgroundColor: iconBg ?? "#f3f4f6",
				color: iconColor ?? "#6b7280",
			}}
			title={icon ?? name}
		>
			<DynamicIcon name={icon} size={iconSize} />
		</div>
	);
}
