import { Card } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { DynamicIcon } from "#/components/ui/icons/category-icon";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { listCategoriesQueryOptions } from "#/queries/categories.queries";
import { listProductsQueryOptions } from "#/queries/products.queries";
import type { GetProductsInputType } from "#/server/catalog/products/products.types";

type Category = {
	category: {
		id: string;
		name: string;
		slug: string;
		icon: string | null;
		iconColor: string | null;
		iconBg: string | null;
		totalProducts?: number;
	};
	showCount?: boolean;
};

export function CategoryCard({ category, showCount = false }: Category) {
	const { prefetch } = useQueryIntentPrefetch();

	const prefetchCategory = () => {
		prefetch(
			listCategoriesQueryOptions({
				searching: { search: category.slug, searchType: "slug" },
			}),
		);
		prefetch(
			listProductsQueryOptions({
				data: {
					pagination: { page: 1, limit: 12 },
					filters: {
						categoryIds: [category.id],
						colorIds: [],
						storageIds: [],
						ramIds: [],
						screenSizeIds: [],
					},
					sorting: { sortBy: "createdAt", sortOrder: "desc" },
					flags: { isActive: true },
				} satisfies GetProductsInputType,
			}),
		);
	};

	return (
		<LinkAnchor
			to="/categories/$slug"
			params={{ slug: category.slug }}
			className="group block w-full min-w-0 no-underline"
			onFocus={prefetchCategory}
			onMouseEnter={prefetchCategory}
		>
			<Card className="min-h-36 w-full items-center gap-4 p-6 text-center transition-all duration-300 sm:group-hover:-translate-y-1 sm:group-hover:border-accent/40 sm:group-hover:shadow-md">
				<div
					className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${category.iconBg ? "" : "bg-default"} ${category.iconColor ? "" : "text-muted"}`}
					style={{
						backgroundColor: category.iconBg ?? undefined,
						color: category.iconColor ?? undefined,
					}}
				>
					<DynamicIcon name={category.icon} size={26} />
				</div>
				<Card.Content className="min-w-0 p-0">
					<div className="flex min-w-0 items-center justify-center gap-1 text-sm font-semibold text-foreground">
						<span className="min-w-0 break-words">{category.name}</span>
						<ArrowRight
							size={14}
							className="text-muted opacity-0 -translate-x-1 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
						/>
					</div>
					{showCount && category.totalProducts !== undefined ? (
						<p className="mt-1 break-words text-xs text-muted">
							{category.totalProducts}{" "}
							{category.totalProducts === 1 ? "product" : "products"}
						</p>
					) : null}
				</Card.Content>
			</Card>
		</LinkAnchor>
	);
}
