"use client";

import { Badge, Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import {
	ChevronDown,
	Menu,
	Package,
	ShoppingCart,
	User2,
	X,
	Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQueryIntentPrefetch } from "#/hooks/use-query-intent-prefetch";
import { signOut, useSession } from "#/lib/auth-client";
import { listAddressesQueryOptions } from "#/queries/addresses.queries";
import { getCartQueryOptions } from "#/queries/cart.queries";
import { listCategoriesQueryOptions } from "#/queries/categories.queries";
import { listCustomerOrdersQueryOptions } from "#/queries/orders.queries";
import { listProductsQueryOptions } from "#/queries/products.queries";
import type { GetProductsInputType } from "#/server/catalog/products/products.types";
import LinkAnchor from "../ui/buttons/link-anchor";
import LinkButton from "../ui/buttons/link-button";

const NAV_LINKS = [
	{ label: "Home", to: "/", prefetch: undefined },
	{ label: "Products", to: "/products", prefetch: "products" },
	{ label: "Categories", to: "/categories", prefetch: "categories" },
] as const;

const catalogProductsInput = {
	pagination: { page: 1, limit: 12 },
	sorting: { sortBy: "createdAt", sortOrder: "desc" },
	flags: { isActive: true },
} satisfies GetProductsInputType;

type HeaderProps = {
	variant?: "default" | "hero";
};

export function Header({ variant = "default" }: HeaderProps) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [avatarOpen, setAvatarOpen] = useState(false);
	const avatarRef = useRef<HTMLDivElement>(null);
	const isHeroVariant = variant === "hero";
	const isOnHero = isHeroVariant && !scrolled && !menuOpen;
	const hasSolidHeader = scrolled || !isHeroVariant;
	const { prefetch } = useQueryIntentPrefetch();

	const { data: sessionData } = useSession();
	const user = sessionData?.user ?? null;

	const { data: cartData } = useQuery(getCartQueryOptions);
	const cartCount = cartData?.data?.cart?.summary?.itemsCount ?? 0;

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
				setAvatarOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const prefetchProducts = () =>
		prefetch(listProductsQueryOptions({ data: catalogProductsInput }));
	const prefetchCategories = () => prefetch(listCategoriesQueryOptions({}));
	const prefetchCart = () => prefetch(getCartQueryOptions);
	const prefetchOrders = () => {
		if (!user) return;
		prefetch(
			listCustomerOrdersQueryOptions({
				status: "all",
				page: 1,
				limit: 10,
			}),
		);
	};
	const prefetchAddresses = () => {
		if (!user) return;
		prefetch(listAddressesQueryOptions);
	};
	const getNavPrefetch = (
		target: (typeof NAV_LINKS)[number]["prefetch"] | undefined,
	) => {
		if (target === "products") return prefetchProducts;
		if (target === "categories") return prefetchCategories;
		return undefined;
	};

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				hasSolidHeader
					? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border"
					: "bg-transparent"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<LinkAnchor to="/" className="flex items-center gap-2 group">
						<div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
							<Zap size={16} className="text-accent-foreground" />
						</div>
						<span
							className={`font-bold text-lg transition-colors ${
								isOnHero ? "text-white" : "text-foreground"
							}`}
						>
							tech<span className="text-accent">store</span>
						</span>
					</LinkAnchor>

					{/* Desktop nav */}
					<nav className="hidden md:flex items-center gap-1">
						{NAV_LINKS.map((link) => {
							const prefetchLink = getNavPrefetch(link.prefetch);
							return (
								<LinkAnchor
									key={link.to}
									to={link.to}
									onFocus={prefetchLink}
									onMouseEnter={prefetchLink}
									className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
										isOnHero
											? "text-white/70 hover:text-white hover:bg-white/10"
											: "text-muted hover:text-foreground hover:bg-default"
									}`}
								>
									{link.label}
								</LinkAnchor>
							);
						})}
					</nav>

					{/* Right side */}
					<div className="hidden md:flex items-center gap-3">
						<Badge.Anchor>
							<LinkAnchor
								to="/cart"
								onFocus={prefetchCart}
								onMouseEnter={prefetchCart}
							>
								<Button
									type="button"
									isIconOnly
									variant="ghost"
									className={`${
										isOnHero
											? "text-white/70 hover:text-white hover:bg-white/10"
											: "text-muted hover:text-foreground hover:bg-default"
									}`}
									aria-label="Cart"
								>
									<ShoppingCart size={20} />
								</Button>
							</LinkAnchor>
							{cartCount > 0 && (
								<Badge color="accent" placement="top-right" size="sm">
									{cartCount > 99 ? "99+" : cartCount}
								</Badge>
							)}
						</Badge.Anchor>

						{user ? (
							<div ref={avatarRef} className="relative">
								<button
									type="button"
									onClick={() => setAvatarOpen((v) => !v)}
									className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
										isOnHero
											? "border-white/20 text-white/80 hover:bg-white/10"
											: "border-border text-foreground hover:bg-default"
									}`}
								>
									<div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
										<User2 size={12} className="text-accent-foreground" />
									</div>
									<span className="text-sm font-medium max-w-24 truncate">
										{user.name}
									</span>
									<ChevronDown size={12} />
								</button>

								{avatarOpen && (
									<div className="absolute right-0 top-full mt-2 w-52 bg-background border border-border rounded-2xl shadow-lg overflow-hidden z-50">
										<div className="px-4 py-3 border-b border-border">
											<p className="text-xs font-semibold text-foreground truncate">
												{user.name}
											</p>
											<p className="text-xs text-muted truncate">
												{user.email}
											</p>
										</div>
										<div className="p-1">
											<LinkAnchor
												to="/account/orders"
												className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-default rounded-xl transition-colors"
												onClick={() => setAvatarOpen(false)}
												onFocus={prefetchOrders}
												onMouseEnter={prefetchOrders}
											>
												<Package size={14} />
												My Orders
											</LinkAnchor>
											<LinkAnchor
												to="/account/addresses"
												className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-default rounded-xl transition-colors"
												onClick={() => setAvatarOpen(false)}
												onFocus={prefetchAddresses}
												onMouseEnter={prefetchAddresses}
											>
												<User2 size={14} />
												My Account
											</LinkAnchor>
										</div>
										<div className="p-1 border-t border-border">
											<button
												type="button"
												onClick={async () => {
													setAvatarOpen(false);
													await signOut();
													window.location.href = "/";
												}}
												className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-xl transition-colors"
											>
												Sign out
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<>
								<LinkButton
									size="sm"
									variant="outline"
									to="/sign-in"
									className={
										isOnHero
											? "border-white/25 text-white hover:bg-white/10"
											: undefined
									}
								>
									Sign In
								</LinkButton>
								<LinkButton size="sm" variant="primary" to="/sign-up">
									Get Started
								</LinkButton>
							</>
						)}
					</div>

					{/* Mobile hamburger */}
					<Button
						type="button"
						isIconOnly
						variant="ghost"
						className={`md:hidden ${
							isOnHero
								? "text-white/80 hover:text-white hover:bg-white/10"
								: "text-muted hover:text-foreground hover:bg-default"
						}`}
						onPress={() => setMenuOpen((v) => !v)}
						aria-label="Toggle menu"
					>
						{menuOpen ? <X size={20} /> : <Menu size={20} />}
					</Button>
				</div>
			</div>

			{/* Mobile menu */}
			{menuOpen && (
				<div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
					<nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
						{NAV_LINKS.map((link) => {
							const prefetchLink = getNavPrefetch(link.prefetch);
							return (
								<LinkAnchor
									key={link.to}
									to={link.to}
									className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors rounded-lg hover:bg-default"
									onClick={() => setMenuOpen(false)}
									onFocus={prefetchLink}
									onMouseEnter={prefetchLink}
								>
									{link.label}
								</LinkAnchor>
							);
						})}
						<div className="flex gap-2 mt-3 pt-3 border-t border-border">
							{user ? (
								<div className="flex-1 space-y-1">
									<p className="text-xs text-muted px-1 mb-2 truncate">
										{user.name}
									</p>
									<LinkAnchor
										to="/account/orders"
										className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors rounded-lg hover:bg-default"
										onClick={() => setMenuOpen(false)}
										onFocus={prefetchOrders}
										onMouseEnter={prefetchOrders}
									>
										My Orders
									</LinkAnchor>
									<LinkAnchor
										to="/account/addresses"
										className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors rounded-lg hover:bg-default"
										onClick={() => setMenuOpen(false)}
										onFocus={prefetchAddresses}
										onMouseEnter={prefetchAddresses}
									>
										My Account
									</LinkAnchor>
									<button
										type="button"
										onClick={async () => {
											setMenuOpen(false);
											await signOut();
											window.location.href = "/";
										}}
										className="w-full text-left px-4 py-3 text-sm font-medium text-danger hover:bg-danger/10 transition-colors rounded-lg"
									>
										Sign out
									</button>
								</div>
							) : (
								<>
									<LinkButton
										size="sm"
										variant="outline"
										className="flex-1"
										to="/sign-in"
									>
										Sign In
									</LinkButton>
									<LinkButton
										size="sm"
										variant="primary"
										className="flex-1"
										to="/sign-up"
									>
										Get Started
									</LinkButton>
								</>
							)}
						</div>
					</nav>
				</div>
			)}
		</header>
	);
}

/**
 * you have to adjust the sign-in button, just to make it more beautiful
 */
