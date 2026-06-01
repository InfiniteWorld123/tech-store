import { Truck, ShieldCheck, Headphones, Lock } from "lucide-react";

const TRUST_ITEMS = [
	{
		icon: Truck,
		title: "Free Shipping",
		description: "On all orders over $50. Next-day delivery available.",
		color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
	},
	{
		icon: ShieldCheck,
		title: "2-Year Warranty",
		description: "All products include a comprehensive warranty.",
		color: "text-green-500 bg-green-100 dark:bg-green-900/30",
	},
	{
		icon: Headphones,
		title: "24/7 Support",
		description: "Our experts are here to help, anytime.",
		color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
	},
	{
		icon: Lock,
		title: "Secure Checkout",
		description: "256-bit SSL encryption on every transaction.",
		color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30",
	},
];

export function TrustSection() {
	return (
		<section className="py-20 bg-surface-secondary">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12">
					<p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
						Why us
					</p>
					<h2 className="text-3xl sm:text-4xl font-bold text-foreground">
						Why Choose TechStore?
					</h2>
					<p className="text-muted mt-3 max-w-xl mx-auto">
						We're committed to delivering the best tech buying experience — from
						browsing to unboxing.
					</p>
				</div>

				{/* Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{TRUST_ITEMS.map(({ icon: Icon, title, description, color }) => (
						<div
							key={title}
							className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-md transition-all duration-300"
						>
							<div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
								<Icon size={26} />
							</div>
							<h3 className="font-semibold text-foreground mb-2">{title}</h3>
							<p className="text-sm text-muted leading-relaxed">{description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
