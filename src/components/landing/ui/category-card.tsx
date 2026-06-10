import { Card } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { DynamicIcon } from "#/components/ui/icons/category-icon";

type Category = {
	category: {
		id: string;
		name: string;
		slug: string;
		icon: string | null;
		iconColor: string | null;
		iconBg: string | null;
	};
};

export function CategoryCard({ category }: Category) {
	return (
		<LinkAnchor
			to="/categories/$slug"
			params={{ slug: category.slug }}
			className="group no-underline"
		>
			<Card className="h-full items-center gap-4 p-6 text-center transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent/40 group-hover:shadow-md">
				<div
					className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${category.iconBg ? "" : "bg-default"} ${category.iconColor ? "" : "text-muted"}`}
					style={{
						backgroundColor: category.iconBg ?? undefined,
						color: category.iconColor ?? undefined,
					}}
				>
					<DynamicIcon name={category.icon} size={26} />
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
