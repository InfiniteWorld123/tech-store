import { Card, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Tags } from "lucide-react";
import { CategoryCard } from "#/components/landing/ui/category-card";
import { Footer } from "#/components/layout/footer";
import { Header } from "#/components/layout/header";
import { listCategoriesQueryOptions } from "#/queries/categories.queries";

const SKELETON_IDS = Array.from({ length: 6 }, (_, i) => `category-skel-${i}`);

export function CategoriesPage() {
	const { data, isLoading } = useQuery(listCategoriesQueryOptions({}));
	const categories = data?.data.items ?? [];
	const hasCategories = categories.length > 0;

	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 pt-20 pb-14 sm:pt-24 sm:pb-20">
				<div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
					{/* Page header */}
					<div className="mb-6 sm:mb-10">
						<p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
							Explore
						</p>
						<h1 className="break-words text-2xl font-bold text-foreground sm:text-4xl">
							Browse Categories
						</h1>
						<p className="mt-2 max-w-xl text-sm leading-6 text-muted sm:text-base">
							Find exactly what you're looking for — shop by product category.
						</p>
					</div>

					{/* Grid */}
					{isLoading ? (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
							{SKELETON_IDS.map((id) => (
								<Card key={id} className="min-h-36 p-6">
									<Skeleton className="mx-auto h-14 w-14 rounded-2xl" />
									<Skeleton className="mx-auto mt-5 h-4 w-20 rounded" />
									<Skeleton className="mx-auto mt-2 h-3 w-16 rounded" />
								</Card>
							))}
						</div>
					) : hasCategories ? (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
							{categories.map((category) => (
								<CategoryCard key={category.id} category={category} showCount />
							))}
						</div>
					) : (
						<Card className="items-center border-dashed px-4 py-12 text-center sm:px-6 sm:py-16">
							<Tags size={28} className="text-muted" />
							<Card.Header className="items-center">
								<Card.Title className="text-base">No categories yet</Card.Title>
								<Card.Description className="max-w-md">
									There are no categories available right now. Check back soon.
								</Card.Description>
							</Card.Header>
						</Card>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
}
