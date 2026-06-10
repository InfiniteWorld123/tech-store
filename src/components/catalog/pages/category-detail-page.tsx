"use client";

import { Card, Chip, Pagination, Skeleton } from "@heroui/react";
import {
	ArrowRight,
	Gamepad2,
	Headphones,
	ImageOff,
	Laptop,
	Plug,
	Smartphone,
	Tablet,
	Tags,
} from "lucide-react";
import { useState } from "react";
import { ProductCard } from "#/components/landing/ui/product-card";
import { Footer } from "#/components/layout/footer";
import { Header } from "#/components/layout/header";
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
	laptops: "bg-blue-100 text-blue-600",
	smartphones: "bg-purple-100 text-purple-600",
	tablets: "bg-cyan-100 text-cyan-600",
	audio: "bg-orange-100 text-orange-600",
	accessories: "bg-green-100 text-green-600",
	gaming: "bg-red-100 text-red-600",
};

const SORT_OPTIONS = [
	{ value: "createdAt:desc", label: "Newest" },
	{ value: "price:asc", label: "Price: Low → High" },
	{ value: "price:desc", label: "Price: High → Low" },
	{ value: "rating:desc", label: "Top Rated" },
	{ value: "reviews:desc", label: "Most Reviewed" },
	{ value: "name:asc", label: "Name A–Z" },
];

const MOCK_PRODUCTS = [
	{ id: "1", name: "MacBook Pro 16\"", brand: "Apple", slug: "macbook-pro-16", image: null, price: 2499, compareAtPrice: 2799, ratingAvg: 4.8, reviewsCount: 342 },
	{ id: "2", name: "Dell XPS 15", brand: "Dell", slug: "dell-xps-15", image: null, price: 1799, compareAtPrice: null, ratingAvg: 4.5, reviewsCount: 218 },
	{ id: "3", name: "ThinkPad X1 Carbon", brand: "Lenovo", slug: "thinkpad-x1-carbon", image: null, price: 1599, compareAtPrice: 1899, ratingAvg: 4.6, reviewsCount: 187 },
	{ id: "4", name: "Surface Laptop 5", brand: "Microsoft", slug: "surface-laptop-5", image: null, price: 1299, compareAtPrice: null, ratingAvg: 4.3, reviewsCount: 94 },
	{ id: "5", name: "Galaxy Book3 Pro", brand: "Samsung", slug: "galaxy-book3-pro", image: null, price: 1399, compareAtPrice: 1599, ratingAvg: 4.4, reviewsCount: 112 },
	{ id: "6", name: "HP Spectre x360", brand: "HP", slug: "hp-spectre-x360", image: null, price: 1449, compareAtPrice: null, ratingAvg: 4.2, reviewsCount: 76 },
	{ id: "7", name: "ASUS ZenBook 14", brand: "ASUS", slug: "asus-zenbook-14", image: null, price: 999, compareAtPrice: 1199, ratingAvg: 4.1, reviewsCount: 155 },
	{ id: "8", name: "Razer Blade 15", brand: "Razer", slug: "razer-blade-15", image: null, price: 2199, compareAtPrice: null, ratingAvg: 4.7, reviewsCount: 203 },
	{ id: "9", name: "MacBook Air M2", brand: "Apple", slug: "macbook-air-m2", image: null, price: 1099, compareAtPrice: 1299, ratingAvg: 4.9, reviewsCount: 521 },
	{ id: "10", name: "Acer Swift 5", brand: "Acer", slug: "acer-swift-5", image: null, price: 849, compareAtPrice: null, ratingAvg: 3.9, reviewsCount: 63 },
	{ id: "11", name: "LG Gram 16", brand: "LG", slug: "lg-gram-16", image: null, price: 1349, compareAtPrice: 1499, ratingAvg: 4.4, reviewsCount: 88 },
	{ id: "12", name: "MSI Creator Z16", brand: "MSI", slug: "msi-creator-z16", image: null, price: 2699, compareAtPrice: null, ratingAvg: 4.6, reviewsCount: 47 },
];

const TOTAL_PAGES = 4;
const TOTAL_ITEMS = 48;

type Props = { slug: string };

function slugToLabel(slug: string) {
	return slug
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

const PRODUCT_SKELETON_IDS = Array.from({ length: 12 }, (_, i) => `skel-${i}`);

export function CategoryDetailPage({ slug }: Props) {
	const [sort, setSort] = useState("createdAt:desc");
	const [page, setPage] = useState(1);

	const categoryName = slugToLabel(slug);
	const Icon = CATEGORY_ICONS[slug] ?? Tags;
	const iconColor = CATEGORY_COLORS[slug] ?? "bg-default text-muted";

	const isLoading = false;
	const hasProducts = MOCK_PRODUCTS.length > 0;

	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 pt-24 pb-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Breadcrumb */}
					<nav className="flex items-center gap-2 text-sm text-muted mb-8">
						<LinkAnchor to="/categories" className="hover:text-foreground transition-colors">
							All categories
						</LinkAnchor>
						<ArrowRight size={14} />
						<span className="text-foreground font-medium">{categoryName}</span>
					</nav>

					{/* Category hero */}
					<div className="flex items-center gap-4 mb-10">
						<div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconColor}`}>
							<Icon size={26} />
						</div>
						<div>
							<h1 className="text-3xl sm:text-4xl font-bold text-foreground">
								{categoryName}
							</h1>
							<div className="flex items-center gap-2 mt-1">
								<Chip size="sm" variant="flat" color="default">
									{TOTAL_ITEMS} products
								</Chip>
							</div>
						</div>
					</div>

					{/* Toolbar */}
					<div className="flex items-center justify-between mb-6">
						<p className="text-sm text-muted hidden sm:block">
							Page {page} of {TOTAL_PAGES}
						</p>
						<div className="relative ml-auto">
							<select
								value={sort}
								onChange={(e) => {
									setSort(e.target.value);
									setPage(1);
								}}
								className="appearance-none pl-3 pr-8 py-2 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all cursor-pointer"
							>
								{SORT_OPTIONS.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{opt.label}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Product grid */}
					{isLoading ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{PRODUCT_SKELETON_IDS.map((id) => (
								<Card key={id} className="overflow-hidden">
									<Skeleton className="aspect-square w-full" />
									<Card.Content className="p-4 flex flex-col gap-2">
										<Skeleton className="h-3 w-16 rounded" />
										<Skeleton className="h-4 w-full rounded" />
										<Skeleton className="h-3 w-24 rounded" />
										<Skeleton className="h-4 w-20 rounded" />
									</Card.Content>
								</Card>
							))}
						</div>
					) : hasProducts ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{MOCK_PRODUCTS.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					) : (
						<Card className="items-center border-dashed px-6 py-16 text-center">
							<ImageOff size={28} className="text-muted" />
							<Card.Header className="items-center">
								<Card.Title className="text-base">No products found</Card.Title>
								<Card.Description className="max-w-md">
									There are no products in this category yet. Check back soon.
								</Card.Description>
							</Card.Header>
						</Card>
					)}

					{/* Pagination */}
					{hasProducts && (
						<div className="mt-10 pt-6 border-t border-border">
							<Pagination className="w-full">
								<Pagination.Summary>
									Showing {(page - 1) * 12 + 1}–{Math.min(page * 12, TOTAL_ITEMS)} of {TOTAL_ITEMS} products
								</Pagination.Summary>
								<Pagination.Content>
									<Pagination.Item>
										<Pagination.Previous
											isDisabled={page === 1}
											onPress={() => setPage((p) => p - 1)}
										>
											<Pagination.PreviousIcon />
											<span>Previous</span>
										</Pagination.Previous>
									</Pagination.Item>

									{Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
										<Pagination.Item key={p}>
											<Pagination.Link
												isActive={p === page}
												onPress={() => setPage(p)}
											>
												{p}
											</Pagination.Link>
										</Pagination.Item>
									))}

									<Pagination.Item>
										<Pagination.Next
											isDisabled={page >= TOTAL_PAGES}
											onPress={() => setPage((p) => p + 1)}
										>
											<span>Next</span>
											<Pagination.NextIcon />
										</Pagination.Next>
									</Pagination.Item>
								</Pagination.Content>
							</Pagination>
						</div>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
}
