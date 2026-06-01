"use client";

import { Button } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingCart, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import LinkButton from "../ui/buttons/link-button";

const NAV_LINKS = [
	{ label: "Home", href: "/" },
	{ label: "Products", href: "/products" },
	{ label: "Categories", href: "/categories" },
];

export function Header() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const isOnHero = !scrolled && !menuOpen;

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled
					? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border"
					: "bg-transparent"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center gap-2 group">
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
					</Link>

					{/* Desktop nav */}
					<nav className="hidden md:flex items-center gap-1">
						{NAV_LINKS.map((link) => (
							<Link
								key={link.href}
								to={link.href}
								className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
									isOnHero
										? "text-white/70 hover:text-white hover:bg-white/10"
										: "text-muted hover:text-foreground hover:bg-default"
								}`}
							>
								{link.label}
							</Link>
						))}
					</nav>

					{/* Right side */}
					<div className="hidden md:flex items-center gap-3">
						<button
							type="button"
							className={`relative p-2 rounded-lg transition-colors ${
								isOnHero
									? "text-white/70 hover:text-white hover:bg-white/10"
									: "text-muted hover:text-foreground hover:bg-default"
							}`}
						>
							<ShoppingCart size={20} />
							<span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
						</button>
						<Link to="/sign-in">
							<Button
								size="sm"
								variant="outline"
								className={
									isOnHero
										? "border-white/25 text-white hover:bg-white/10"
										: undefined
								}
							>
								Sign In
							</Button>
						</Link>
						<Link to="/sign-up">
							<Button size="sm" variant="primary">
								Get Started
							</Button>
						</Link>
					</div>

					{/* Mobile hamburger */}
					<button
						type="button"
						className={`md:hidden p-2 rounded-lg transition-colors ${
							isOnHero
								? "text-white/80 hover:text-white hover:bg-white/10"
								: "text-muted hover:text-foreground hover:bg-default"
						}`}
						onClick={() => setMenuOpen((v) => !v)}
						aria-label="Toggle menu"
					>
						{menuOpen ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			{menuOpen && (
				<div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
					<nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
						{NAV_LINKS.map((link) => (
							<Link
								key={link.href}
								to={link.href}
								className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors rounded-lg hover:bg-default"
								onClick={() => setMenuOpen(false)}
							>
								{link.label}
							</Link>
						))}
						<div className="flex gap-2 mt-3 pt-3 border-t border-border">
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
