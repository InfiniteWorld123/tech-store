import { Card, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Tags } from "lucide-react";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { useCategoriesQueryOptions } from "#/hooks/categories.hooks";
import { CategoryCard } from "../ui/category-card";

const CATEGORY_SKELETON_IDS = [
	"category-skeleton-1",
	"category-skeleton-2",
	"category-skeleton-3",
	"category-skeleton-4",
	"category-skeleton-5",
	"category-skeleton-6",
];

export function CategoriesSection() {
	const { data, isError, isLoading } = useQuery(useCategoriesQueryOptions);
	const categories = data?.data.items.slice(0, 6) ?? [];
	const hasCategories = categories.length > 0;

	return (
		<section className="py-20 bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex items-end justify-between mb-10">
					<div>
						<p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
							Explore
						</p>
						<h2 className="text-3xl sm:text-4xl font-bold text-foreground">
							Shop by Category
						</h2>
					</div>
					{hasCategories && (
						<LinkAnchor
							to="/categories"
							className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors group"
						>
							View all
							<ArrowRight
								size={16}
								className="group-hover:translate-x-0.5 transition-transform"
							/>
						</LinkAnchor>
					)}
				</div>

				{/* Grid */}
				{isLoading ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
						{CATEGORY_SKELETON_IDS.map((skeletonId) => (
							<Card key={skeletonId} className="h-40 items-center p-6">
								<Skeleton className="h-14 w-14 rounded-2xl" />
								<Card.Content className="mt-5 p-0">
									<Skeleton className="h-4 w-20 rounded" />
								</Card.Content>
							</Card>
						))}
					</div>
				) : hasCategories ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
						{categories.map((category) => (
							<CategoryCard key={category.id} category={category} />
						))}
					</div>
				) : (
					<Card className="items-center border-dashed px-6 py-12 text-center">
						<Tags size={26} className="text-muted" />
						<Card.Header className="items-center">
							<Card.Title className="text-base">No categories yet</Card.Title>
							<Card.Description className="max-w-md">
								{isError
									? "We couldn't load categories right now. Please try again later."
									: "There are no categories available right now. Check back soon."}
							</Card.Description>
						</Card.Header>
					</Card>
				)}

				{/* Mobile "view all" */}
				{hasCategories && (
					<div className="mt-6 flex sm:hidden">
						<LinkAnchor
							to="/categories"
							className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
						>
							View all categories
							<ArrowRight size={16} />
						</LinkAnchor>
					</div>
				)}
			</div>
		</section>
	);
}
