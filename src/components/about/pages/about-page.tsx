import LinkButton from "#/components/ui/buttons/link-button";
import { Footer } from "#/components/layout/footer";
import { Header } from "#/components/layout/header";
import {
	ArrowRight,
	Camera,
	Cpu,
	Headphones,
	Monitor,
	ShieldCheck,
	Smartphone,
	Truck,
	Users,
	Watch,
	Zap,
} from "lucide-react";

const STATS = [
	{ value: "500+", label: "Products" },
	{ value: "24", label: "Categories" },
	{ value: "12K+", label: "Happy Customers" },
	{ value: "< 2h", label: "Support Response" },
];

const VALUES = [
	{
		icon: ShieldCheck,
		title: "Quality First",
		description:
			"Every product is vetted for performance and durability. We only stock what we'd buy ourselves.",
		color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
	},
	{
		icon: Truck,
		title: "Fast Delivery",
		description:
			"Next-day delivery on orders placed before 2 pm. We know you can't wait to unbox your new tech.",
		color: "text-green-500 bg-green-100 dark:bg-green-900/30",
	},
	{
		icon: Headphones,
		title: "Expert Support",
		description:
			"Real humans, not bots. Our tech experts are here Mon–Fri to help you make the right choice.",
		color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
	},
	{
		icon: Zap,
		title: "Always Current",
		description:
			"New arrivals every week. We track the latest releases so you're always shopping the newest tech.",
		color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30",
	},
];

const TECH_SHOWCASE = [
	{ icon: Monitor, label: "Laptops" },
	{ icon: Smartphone, label: "Phones" },
	{ icon: Cpu, label: "Components" },
	{ icon: Headphones, label: "Audio" },
	{ icon: Camera, label: "Cameras" },
	{ icon: Watch, label: "Wearables" },
];

export function AboutPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">
				{/* Hero */}
				<section className="relative min-h-[70vh] flex items-center overflow-hidden bg-foreground">
					<div
						className="absolute inset-0 opacity-[0.04]"
						style={{
							backgroundImage: `linear-gradient(to right, oklch(99.11% 0 0) 1px, transparent 1px),
								linear-gradient(to bottom, oklch(99.11% 0 0) 1px, transparent 1px)`,
							backgroundSize: "60px 60px",
						}}
					/>
					<div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
					<div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
						<div className="max-w-2xl">
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium mb-8">
								<Users size={14} />
								Our Story
							</div>
							<h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
								Tech You Can Trust,{" "}
								<span className="text-accent">Delivered Fast.</span>
							</h1>
							<p className="text-lg text-white/60 leading-relaxed mb-10">
								TechStore was built on a simple idea: buying the latest
								technology should be easy, transparent, and backed by people who
								actually care. No gimmicks — just great gear and honest service.
							</p>
							<div className="flex flex-wrap gap-4">
								<LinkButton
									to="/categories"
									size="lg"
									variant="primary"
									className="font-semibold"
								>
									Browse Products <ArrowRight size={18} className="ml-1" />
								</LinkButton>
								<LinkButton
									to="/categories"
									size="lg"
									variant="outline"
									className="font-semibold border-white/20 text-white hover:bg-white/10"
								>
									Explore Categories
								</LinkButton>
							</div>
						</div>
					</div>
				</section>

				{/* Stats */}
				<section className="py-16 bg-surface-secondary border-y border-border">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
							{STATS.map(({ value, label }) => (
								<div key={label} className="text-center">
									<p className="text-4xl font-extrabold text-accent mb-1">
										{value}
									</p>
									<p className="text-sm text-muted font-medium uppercase tracking-widest">
										{label}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Story */}
				<section className="py-24 bg-background">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
							<div>
								<p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">
									Who We Are
								</p>
								<h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
									A store built by tech lovers, for tech lovers.
								</h2>
								<div className="space-y-4 text-muted leading-relaxed">
									<p>
										TechStore started as a passion project — a way to cut
										through the noise of online retail and give people a curated
										selection of electronics that actually matter. We cover
										everything from flagship smartphones and laptops to the
										accessories that make them shine.
									</p>
									<p>
										Every item in our catalog goes through a review process. If
										it doesn't meet our bar for build quality, performance, and
										value, it doesn't make the cut. We'd rather carry 500
										excellent products than 5,000 mediocre ones.
									</p>
									<p>
										We believe great service is just as important as great
										products. That's why our support team responds in under two
										hours and every purchase is backed by a no-fuss return
										policy.
									</p>
								</div>
							</div>

							{/* Tech showcase grid */}
							<div className="grid grid-cols-3 gap-4">
								{TECH_SHOWCASE.map(({ icon: Icon, label }, i) => (
									<div
										key={label}
										className={`rounded-2xl flex flex-col items-center justify-center gap-3 p-6 aspect-square transition-all duration-300 ${
											i % 2 === 0
												? "bg-accent/10 border border-accent/20 hover:bg-accent/15"
												: "bg-surface-secondary border border-border hover:border-accent/20"
										}`}
									>
										<Icon
											size={30}
											className={i % 2 === 0 ? "text-accent" : "text-muted"}
										/>
										<span
											className={`text-xs font-medium ${
												i % 2 === 0 ? "text-accent" : "text-muted"
											}`}
										>
											{label}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Values */}
				<section className="py-24 bg-surface-secondary">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-12">
							<p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
								Our Promise
							</p>
							<h2 className="text-3xl sm:text-4xl font-bold text-foreground">
								Why Customers Choose TechStore
							</h2>
							<p className="text-muted mt-3 max-w-xl mx-auto">
								Four principles that guide everything we do, from the products we
								carry to the support we provide.
							</p>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{VALUES.map(({ icon: Icon, title, description, color }) => (
								<div
									key={title}
									className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-md transition-all duration-300"
								>
									<div
										className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${color}`}
									>
										<Icon size={26} />
									</div>
									<h3 className="font-semibold text-foreground mb-2">{title}</h3>
									<p className="text-sm text-muted leading-relaxed">
										{description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="relative py-20 overflow-hidden bg-foreground">
					<div
						className="absolute inset-0 opacity-[0.04]"
						style={{
							backgroundImage: `linear-gradient(to right, oklch(99.11% 0 0) 1px, transparent 1px),
								linear-gradient(to bottom, oklch(99.11% 0 0) 1px, transparent 1px)`,
							backgroundSize: "60px 60px",
						}}
					/>
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
							Ready to upgrade your tech?
						</h2>
						<p className="text-white/60 mb-8 max-w-xl mx-auto">
							Thousands of products, fast shipping, and a team that's here to
							help. What are you waiting for?
						</p>
						<div className="flex flex-wrap justify-center gap-4">
							<LinkButton
								to="/"
								size="lg"
								variant="primary"
								className="font-semibold"
							>
								Start Shopping <ArrowRight size={18} className="ml-1" />
							</LinkButton>
							<LinkButton
								to="/categories"
								size="lg"
								variant="outline"
								className="font-semibold border-white/20 text-white hover:bg-white/10"
							>
								Browse Categories
							</LinkButton>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
