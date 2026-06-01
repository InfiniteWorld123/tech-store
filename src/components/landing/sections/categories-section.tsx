import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Tags } from "lucide-react";
import { categoriesQueryOptions } from "#/queries/categories.queries";
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
	const { data, isError, isLoading } = useQuery(categoriesQueryOptions);
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
						<Link
							to="/categories"
							className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors group"
						>
							View all
							<ArrowRight
								size={16}
								className="group-hover:translate-x-0.5 transition-transform"
							/>
						</Link>
					)}
				</div>

				{/* Grid */}
				{isLoading ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
						{CATEGORY_SKELETON_IDS.map((skeletonId) => (
							<div
								key={skeletonId}
								className="h-40 rounded-2xl bg-surface border border-border animate-pulse"
							/>
						))}
					</div>
				) : hasCategories ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
						{categories.map((category) => (
							<CategoryCard key={category.id} category={category} />
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
						<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-default text-muted">
							<Tags size={26} />
						</div>
						<h3 className="text-base font-semibold text-foreground">
							No categories yet
						</h3>
						<p className="mt-2 max-w-md text-sm text-muted">
							{isError
								? "We couldn't load categories right now. Please try again later."
								: "There are no categories available right now. Check back soon."}
						</p>
					</div>
				)}

				{/* Mobile "view all" */}
				{hasCategories && (
					<div className="mt-6 flex sm:hidden">
						<Link
							to="/categories"
							className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
						>
							View all categories
							<ArrowRight size={16} />
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
