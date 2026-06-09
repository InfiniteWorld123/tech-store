import { Card, Link, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, PackageSearch, TrendingUp } from "lucide-react";
import { useBestsellerProductsQueryOptions } from "#/hooks/products.hooks.ts";
import { ProductCard } from "../ui/product-card";

const BESTSELLER_PRODUCT_SKELETON_IDS = [
	"bestseller-product-skeleton-1",
	"bestseller-product-skeleton-2",
	"bestseller-product-skeleton-3",
	"bestseller-product-skeleton-4",
];

export function BestsellersSection() {
	const { data, isError, isLoading } = useQuery(useBestsellerProductsQueryOptions);
	const products = data?.data.items ?? [];
	const hasProducts = products.length > 0;

	return (
		<section className="py-20 bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex items-end justify-between mb-10">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<TrendingUp size={16} className="text-warning" />
							<p className="text-warning text-sm font-semibold uppercase tracking-widest">
								Trending
							</p>
						</div>
						<h2 className="text-3xl sm:text-4xl font-bold text-foreground">
							Best Sellers
						</h2>
					</div>
					{hasProducts && (
						<Link
							href="/products?bestseller=true"
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
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{BESTSELLER_PRODUCT_SKELETON_IDS.map((skeletonId) => (
							<Card key={skeletonId} className="aspect-[3/4] p-4">
								<Skeleton className="h-3/5 rounded-lg" />
								<Card.Content className="mt-4 gap-3 p-0">
									<Skeleton className="h-3 w-2/5 rounded" />
									<Skeleton className="h-4 w-4/5 rounded" />
									<Skeleton className="h-4 w-1/2 rounded" />
								</Card.Content>
							</Card>
						))}
					</div>
				) : hasProducts ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{products.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								badge={{
									label: "Best Seller",
									color: "warning",
								}}
							/>
						))}
					</div>
				) : (
					<Card className="items-center border-dashed px-6 py-12 text-center">
						<PackageSearch size={26} className="text-muted" />
						<Card.Header className="items-center">
							<Card.Title className="text-base">No best sellers yet</Card.Title>
							<Card.Description className="max-w-md">
								{isError
									? "We couldn't load best-selling products right now. Please try again later."
									: "There are no best-selling products available right now. Check back soon."}
							</Card.Description>
						</Card.Header>
					</Card>
				)}

				{/* Mobile link */}
				{hasProducts && (
					<div className="mt-8 flex sm:hidden">
						<Link
							href="/products?bestseller=true"
							className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
						>
							View all best sellers
							<ArrowRight size={16} />
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
