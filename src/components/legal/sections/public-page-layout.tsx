import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Footer } from "#/components/layout/footer";
import { Header } from "#/components/layout/header";
import LinkButton from "#/components/ui/buttons/link-button";

type PageHeroProps = {
	eyebrow: string;
	title: string;
	description: string;
	icon?: LucideIcon;
	actions?: ReactNode;
};

type PublicPageLayoutProps = PageHeroProps & {
	children: ReactNode;
};

export function PublicPageLayout({
	eyebrow,
	title,
	description,
	icon: Icon,
	actions,
	children,
}: PublicPageLayoutProps) {
	return (
		<div className="min-h-screen flex flex-col bg-background">
			<Header />
			<main className="flex-1 pt-16">
				<section className="relative overflow-hidden bg-foreground text-white">
					<div
						className="absolute inset-0 opacity-[0.05]"
						style={{
							backgroundImage:
								"linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
							backgroundSize: "52px 52px",
						}}
					/>
					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
						<div className="max-w-3xl">
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium mb-6">
								{Icon ? <Icon size={15} /> : null}
								{eyebrow}
							</div>
							<h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
								{title}
							</h1>
							<p className="mt-5 text-lg text-white/65 leading-relaxed">
								{description}
							</p>
							{actions ? (
								<div className="mt-8 flex flex-wrap gap-3">{actions}</div>
							) : null}
						</div>
					</div>
				</section>
				{children}
			</main>
			<Footer />
		</div>
	);
}

export function ShopCta({
	title = "Ready to browse the store?",
	description = "Explore curated tech, everyday accessories, and demo checkout flows built for a real e-commerce experience.",
}: {
	title?: string;
	description?: string;
}) {
	return (
		<section className="bg-surface-secondary py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="rounded-2xl border border-border bg-surface p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
					<div>
						<p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
							TechStore
						</p>
						<h2 className="text-2xl sm:text-3xl font-bold text-foreground">
							{title}
						</h2>
						<p className="text-muted mt-3 max-w-2xl leading-relaxed">
							{description}
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<LinkButton to="/" variant="primary">
							Browse products <ArrowRight size={16} className="ml-1" />
						</LinkButton>
						<LinkButton to="/categories" variant="outline">
							Explore categories
						</LinkButton>
					</div>
				</div>
			</div>
		</section>
	);
}
