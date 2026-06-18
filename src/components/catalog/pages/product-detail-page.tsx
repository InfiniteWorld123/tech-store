"use client";

import { Button, Card, Chip } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { Footer } from "#/components/layout/footer";
import { Header } from "#/components/layout/header";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { useAddToCart } from "#/mutations/cart/use-add-to-cart";
import { getProductBySlugQueryOptions } from "#/queries/products.queries";
import { ProductImagesGallery } from "../sections/product-images-gallery";
import { ProductReviewsSection } from "../sections/product-reviews-section";
import { ProductVariantSelector } from "../sections/product-variant-selector";

type Props = { slug: string };

export function ProductDetailPage({ slug }: Props) {
	const { data } = useQuery(getProductBySlugQueryOptions({ slug }));
	const product = data?.data?.product ?? null;

	const defaultVariant =
		product?.variants?.find((v) => v.isDefault) ??
		product?.variants?.[0] ??
		null;
	const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
		defaultVariant?.id ?? null,
	);
	const [quantity, setQuantity] = useState(1);
	const [activeTab, setActiveTab] = useState<"description" | "reviews">(
		"description",
	);

	const { mutate: addToCart, isPending } = useAddToCart();

	const selectedVariant =
		product?.variants?.find((v) => v.id === selectedVariantId) ??
		defaultVariant;

	if (!product) {
		return (
			<div className="min-h-screen flex flex-col">
				<Header />
				<main className="flex-1 pt-20 pb-14 flex items-center justify-center px-3 sm:pt-24 sm:pb-20">
					<Card className="max-w-sm items-center border-dashed px-4 py-12 text-center sm:px-6 sm:py-16">
						<Card.Header className="items-center">
							<Card.Title>Product not found</Card.Title>
							<Card.Description>
								This product may have been removed or is unavailable.
							</Card.Description>
						</Card.Header>
					</Card>
				</main>
				<Footer />
			</div>
		);
	}

	const inStock = (selectedVariant?.stockQuantity ?? 0) > 0;
	const lowStock = inStock && (selectedVariant?.stockQuantity ?? 0) <= 5;
	const price = selectedVariant?.price ?? null;
	const compareAtPrice = selectedVariant?.compareAtPrice ?? null;
	const discount =
		price && compareAtPrice
			? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
			: null;

	const variantImages = selectedVariant?.images ?? [];

	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 pt-20 pb-14 sm:pt-24 sm:pb-20">
				<div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
					{/* Breadcrumb */}
					<nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted sm:mb-8">
						<LinkAnchor
							to="/"
							className="hover:text-foreground transition-colors"
						>
							Home
						</LinkAnchor>
						<ArrowRight size={14} className="flex-shrink-0" />
						<LinkAnchor
							to="/categories/$slug"
							params={{ slug: product.category.slug }}
							className="hover:text-foreground transition-colors"
						>
							{product.category.name}
						</LinkAnchor>
						<ArrowRight size={14} className="flex-shrink-0" />
						<span className="min-w-0 max-w-full break-words font-medium text-foreground">
							{product.name}
						</span>
					</nav>

					<div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-16">
						{/* Left: images */}
						<ProductImagesGallery
							mainImage={product.image}
							variantImages={variantImages}
							productName={product.name}
						/>

						{/* Right: info */}
						<div className="flex min-w-0 flex-col gap-6">
							{/* Badges */}
							<div className="flex flex-wrap gap-2">
								{product.isFeatured && (
									<Chip size="sm" color="accent" variant="soft">
										Featured
									</Chip>
								)}
								{product.isBestseller && (
									<Chip size="sm" color="warning" variant="soft">
										Best Seller
									</Chip>
								)}
								{!inStock && (
									<Chip size="sm" color="danger" variant="soft">
										Out of stock
									</Chip>
								)}
								{lowStock && (
									<Chip size="sm" color="warning" variant="soft">
										Only {selectedVariant?.stockQuantity} left
									</Chip>
								)}
							</div>

							{/* Title */}
							<div className="min-w-0">
								<p className="text-sm font-medium text-muted uppercase tracking-wide mb-1">
									{product.brand}
								</p>
								<h1 className="break-words text-2xl font-bold leading-snug text-foreground sm:text-3xl">
									{product.name}
								</h1>
							</div>

							{/* Rating */}
							{product.reviewsCount > 0 && (
								<div className="flex flex-wrap items-center gap-2">
									<div className="flex gap-0.5">
										{[1, 2, 3, 4, 5].map((i) => (
											<Star
												key={i}
												size={14}
												className={
													i <= Math.round(product.ratingAvg)
														? "fill-warning text-warning"
														: "fill-default text-default"
												}
											/>
										))}
									</div>
									<span className="text-sm text-muted">
										{product.ratingAvg.toFixed(1)} · {product.reviewsCount}{" "}
										review
										{product.reviewsCount !== 1 ? "s" : ""}
									</span>
								</div>
							)}

							{/* Price */}
							<div className="flex flex-wrap items-baseline gap-3">
								{price !== null ? (
									<>
										<span className="break-words text-3xl font-bold text-foreground">
											€{price.toLocaleString()}
										</span>
										{compareAtPrice && (
											<span className="text-lg text-muted line-through">
												€{compareAtPrice.toLocaleString()}
											</span>
										)}
										{discount && (
											<Chip size="sm" color="danger" variant="primary">
												-{discount}%
											</Chip>
										)}
									</>
								) : (
									<span className="text-lg text-muted">Price unavailable</span>
								)}
							</div>

							{/* Short description */}
							{product.shortDescription && (
								<p className="text-muted text-sm leading-relaxed">
									{product.shortDescription}
								</p>
							)}

							{/* Variant selector */}
							<ProductVariantSelector
								variants={product.variants}
								selectedVariantId={selectedVariantId}
								onSelect={(id) => {
									setSelectedVariantId(id);
									setQuantity(1);
								}}
							/>

							{/* Quantity + add to cart */}
							<div className="grid grid-cols-1 gap-3 sm:flex sm:items-center">
								<div className="flex w-full items-center justify-center gap-1 overflow-hidden rounded-xl border border-border sm:w-auto">
									<button
										type="button"
										onClick={() => setQuantity((q) => Math.max(1, q - 1))}
										disabled={quantity <= 1}
										className="px-3 py-2 text-muted hover:text-foreground disabled:opacity-40 transition-colors"
									>
										<Minus size={14} />
									</button>
									<span className="w-8 text-center text-sm font-medium text-foreground">
										{quantity}
									</span>
									<button
										type="button"
										onClick={() =>
											setQuantity((q) =>
												Math.min(q + 1, selectedVariant?.stockQuantity ?? 99),
											)
										}
										disabled={
											!inStock ||
											quantity >= (selectedVariant?.stockQuantity ?? 99)
										}
										className="px-3 py-2 text-muted hover:text-foreground disabled:opacity-40 transition-colors"
									>
										<Plus size={14} />
									</button>
								</div>

								<Button
									variant="primary"
									className="w-full sm:flex-1"
									isDisabled={!inStock || !selectedVariantId || price === null}
									isPending={isPending}
									onPress={() => {
										if (selectedVariantId) {
											addToCart({ variantId: selectedVariantId, quantity });
										}
									}}
								>
									<ShoppingCart size={16} />
									{inStock ? "Add to cart" : "Out of stock"}
								</Button>
							</div>

							{/* Warranty */}
							{product.warrantyInfo && (
								<div className="border border-border rounded-xl p-3 text-xs text-muted">
									<span className="font-medium text-foreground">
										Warranty:{" "}
									</span>
									{product.warrantyInfo}
								</div>
							)}
						</div>
					</div>

					{/* Tabs: Description + Reviews */}
					<div className="mt-12 sm:mt-16">
						<div className="-mx-3 mb-6 flex gap-1 overflow-x-auto border-b border-border px-3 sm:mx-0 sm:mb-8 sm:px-0">
							{(["description", "reviews"] as const).map((tab) => (
								<button
									key={tab}
									type="button"
									onClick={() => setActiveTab(tab)}
									className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
										activeTab === tab
											? "border-accent text-accent"
											: "border-transparent text-muted hover:text-foreground"
									}`}
								>
									{tab}
									{tab === "reviews" && product.reviewsCount > 0
										? ` (${product.reviewsCount})`
										: ""}
								</button>
							))}
						</div>

						{activeTab === "description" ? (
							<div
								className="prose prose-sm max-w-none text-muted"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: product description is admin-controlled HTML
								dangerouslySetInnerHTML={{ __html: product.description }}
							/>
						) : (
							<ProductReviewsSection productId={product.id} />
						)}
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
