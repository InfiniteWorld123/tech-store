import {
	Award,
	HeartHandshake,
	MapPin,
	ShieldCheck,
	Sparkles,
	Truck,
	Zap,
} from "lucide-react";
import { InfoCard } from "#/components/legal/sections/info-card";
import {
	PublicPageLayout,
	ShopCta,
} from "#/components/legal/sections/public-page-layout";
import LinkButton from "#/components/ui/buttons/link-button";

const STATS = [
	{ value: "2,400+", label: "demo orders shipped" },
	{ value: "180+", label: "curated tech items" },
	{ value: "4.8/5", label: "customer support rating" },
	{ value: "14 days", label: "EU return window" },
];

const VALUES = [
	{
		icon: Sparkles,
		title: "Curated, not crowded",
		description:
			"The catalog is shaped around useful specs, clear product data, and comparison-friendly shopping flows.",
	},
	{
		icon: ShieldCheck,
		title: "Trust before checkout",
		description:
			"Clear delivery, returns, warranty, and privacy information is visible before customers decide to buy.",
	},
	{
		icon: HeartHandshake,
		title: "Support that feels human",
		description:
			"Customers get simple contact routes, order help, and practical answers instead of vague support promises.",
	},
];

export function AboutPage() {
	return (
		<PublicPageLayout
			eyebrow="Berlin-built demo store"
			title="A cleaner way to shop for everyday tech."
			description="TechStore Demo GmbH is a portfolio e-commerce experience designed to feel like a serious German online shop: polished, transparent, and easy to trust."
			icon={Zap}
			actions={
				<>
					<LinkButton to="/" variant="primary">
						Browse products
					</LinkButton>
					<LinkButton
						to="/contact"
						variant="outline"
						className="border-white/20 text-white hover:bg-white/10"
					>
						Contact us
					</LinkButton>
				</>
			}
		>
			<section className="py-16 sm:py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
						<div>
							<p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
								Our story
							</p>
							<h2 className="text-3xl sm:text-4xl font-bold text-foreground">
								Built like a real shop, honest like a portfolio.
							</h2>
							<div className="mt-5 space-y-4 text-muted leading-relaxed">
								<p>
									TechStore is a demo online store built around real e-commerce
									patterns, realistic support pages, and Germany-aware policy
									content so the project feels complete without depending on a
									fixed category list.
								</p>
								<p>
									The goal is simple: make browsing, buying, tracking, and
									asking for help feel predictable. Every page is written like a
									real customer might read it before trusting a store with an
									order.
								</p>
							</div>
						</div>
						<div className="rounded-3xl border border-border bg-surface-secondary p-6">
							<div className="grid grid-cols-2 gap-4">
								{STATS.map((stat) => (
									<div
										key={stat.label}
										className="rounded-2xl bg-surface border border-border p-5"
									>
										<p className="text-2xl font-extrabold text-foreground">
											{stat.value}
										</p>
										<p className="text-sm text-muted mt-1">{stat.label}</p>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="grid md:grid-cols-3 gap-6 mt-12">
						{VALUES.map((item) => (
							<InfoCard key={item.title} {...item} />
						))}
					</div>
					<div className="grid md:grid-cols-3 gap-6 mt-6">
						<InfoCard
							icon={Truck}
							title="Germany-first shipping"
							description="Standard delivery is modeled around DHL-style German and EU shipping expectations."
						/>
						<InfoCard
							icon={Award}
							title="Warranty clarity"
							description="Support pages explain returns, warranty, and order help before customers need them."
						/>
						<InfoCard
							icon={MapPin}
							title="Berlin presence"
							description="The store uses realistic Berlin demo details, including Impressum and privacy pages."
						/>
					</div>
				</div>
			</section>
			<ShopCta />
		</PublicPageLayout>
	);
}
