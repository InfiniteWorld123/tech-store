import { Chip } from "@heroui/react";
import { ArrowRight, Shield, Truck, Zap } from "lucide-react";
import LinkButton from "#/components/ui/buttons/link-button";

const BADGES = [
	{ icon: Zap, label: "Next-day delivery" },
	{ icon: Shield, label: "2-year warranty" },
	{ icon: Truck, label: "Free shipping $50+" },
];

export function HeroSection() {
	return (
		<section className="relative min-h-screen flex items-center overflow-hidden bg-foreground">
			{/* Grid background */}
			<div
				className="absolute inset-0 opacity-[0.04]"
				style={{
					backgroundImage: `linear-gradient(to right, oklch(99.11% 0 0) 1px, transparent 1px),
						linear-gradient(to bottom, oklch(99.11% 0 0) 1px, transparent 1px)`,
					backgroundSize: "60px 60px",
				}}
			/>

			{/* Gradient blobs */}
			<div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
			<div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
				<div className="max-w-3xl">
					<Chip
						color="accent"
						variant="soft"
						className="mb-8 border border-accent/30 bg-accent/10"
					>
						<Zap size={14} />
						<Chip.Label>New arrivals every week</Chip.Label>
					</Chip>

					{/* Headline */}
					<h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
						Next-Gen Tech, <span className="text-accent">Right Here.</span>
					</h1>

					{/* Subheadline */}
					<p className="text-lg sm:text-xl text-white/60 leading-relaxed mb-10 max-w-2xl">
						Premium gadgets and electronics with fast shipping and expert
						support. Everything you need, nothing you don't.
					</p>

					{/* CTAs */}
					<div className="flex flex-wrap gap-4 mb-14">
						<LinkButton
							to="/"
							size="lg"
							variant="primary"
							className="font-semibold"
						>
							Shop Now <ArrowRight size={18} className="ml-1" />
						</LinkButton>

						<LinkButton
							to="/"
							size="lg"
							variant="outline"
							className="font-semibold border-white/20 text-white hover:bg-white/10"
						>
							Browse Categories
						</LinkButton>
					</div>

					{/* Trust badges */}
					<div className="flex flex-wrap gap-6">
						{BADGES.map(({ icon: Icon, label }) => (
							<div
								key={label}
								className="flex items-center gap-2 text-white/50 text-sm"
							>
								<Icon size={16} className="text-accent" />
								{label}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
