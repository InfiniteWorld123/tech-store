import { Card } from "@heroui/react";
import {
	ArrowRight,
	Gamepad2,
	Headphones,
	ImageOff,
	Laptop,
	Plug,
	Smartphone,
	Tablet,
} from "lucide-react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
	laptops: Laptop,
	smartphones: Smartphone,
	tablets: Tablet,
	audio: Headphones,
	accessories: Plug,
	gaming: Gamepad2,
};

const CATEGORY_COLORS: Record<string, string> = {
	laptops: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
	smartphones:
		"bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
	tablets: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
	audio:
		"bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
	accessories:
		"bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
	gaming: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

type Category = {
	category: {
		id: string;
		name: string;
		slug: string;
		image: string | null;
	};
};

export function CategoryCard({ category }: Category) {
	const Icon = CATEGORY_ICONS[category.slug] ?? ImageOff;
	const colorClass = CATEGORY_COLORS[category.slug] ?? "bg-default text-muted";

	return (
		<LinkAnchor
			to="/categories/$slug"
			params={{ slug: category.slug }}
			className="group no-underline"
		>
			<Card className="h-full items-center gap-4 p-6 text-center transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent/40 group-hover:shadow-md">
				<div
					className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass} transition-transform duration-300 group-hover:scale-110`}
				>
					<Icon size={26} />
				</div>
				<Card.Content className="p-0">
					<div className="flex items-center justify-center gap-1 text-sm font-semibold text-foreground">
						{category.name}
						<ArrowRight
							size={14}
							className="text-muted opacity-0 -translate-x-1 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
						/>
					</div>
				</Card.Content>
			</Card>
		</LinkAnchor>
	);
}
