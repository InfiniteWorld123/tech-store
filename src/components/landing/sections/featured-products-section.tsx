import { useQuery } from "@tanstack/react-query";
import { ArrowRight, PackageSearch } from "lucide-react";
import { featuredProductsQueryOptions } from "#/queries/products.queries";
import { ProductCard } from "../ui/product-card";

const FEATURED_PRODUCT_SKELETON_IDS = [
	"featured-product-skeleton-1",
	"featured-product-skeleton-2",
	"featured-product-skeleton-3",
	"featured-product-skeleton-4",
];

export function FeaturedProductsSection() {
	const { data, isError, isLoading } = useQuery(featuredProductsQueryOptions);
	const products = data?.data.items ?? [];
	const hasProducts = products.length > 0;

	return (
		<section className="py-20 bg-surface-secondary">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex items-end justify-between mb-10">
					<div>
						<p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
							Handpicked
						</p>
						<h2 className="text-3xl sm:text-4xl font-bold text-foreground">
							Featured Products
						</h2>
					</div>
					{hasProducts && (
						<a
							href="/products?featured=true"
							className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors group"
						>
							View all
							<ArrowRight
								size={16}
								className="group-hover:translate-x-0.5 transition-transform"
							/>
						</a>
					)}
				</div>

				{/* Grid */}
				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{FEATURED_PRODUCT_SKELETON_IDS.map((skeletonId) => (
							<div
								key={skeletonId}
								className="aspect-[3/4] rounded-lg bg-surface border border-border animate-pulse"
							/>
						))}
					</div>
				) : hasProducts ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{products.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								badge={{
									label: "Featured",
									className: "bg-accent text-accent-foreground",
								}}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
						<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-default text-muted">
							<PackageSearch size={26} />
						</div>
						<h3 className="text-base font-semibold text-foreground">
							No featured products yet
						</h3>
						<p className="mt-2 max-w-md text-sm text-muted">
							{isError
								? "We couldn't load featured products right now. Please try again later."
								: "There are no featured products available right now. Check back soon."}
						</p>
					</div>
				)}

				{/* Mobile link */}
				{hasProducts && (
					<div className="mt-8 flex sm:hidden">
						<a
							href="/products?featured=true"
							className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
						>
							View all featured products
							<ArrowRight size={16} />
						</a>
					</div>
				)}
			</div>
		</section>
	);
}
