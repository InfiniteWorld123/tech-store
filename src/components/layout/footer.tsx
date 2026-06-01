import { GitBranch, Mail, MessageCircle, Zap } from "lucide-react";

const QUICK_LINKS = [
	{ label: "Products", href: "/products" },
	{ label: "Categories", href: "/categories" },
	{ label: "About Us", href: "/about" },
	{ label: "Contact", href: "/contact" },
];

const SUPPORT_LINKS = [
	{ label: "FAQ", href: "/faq" },
	{ label: "Shipping Policy", href: "/shipping" },
	{ label: "Returns", href: "/returns" },
	{ label: "Track Order", href: "/track" },
	{ label: "Withdrawal", href: "/withdrawal" },
	{ label: "Impressum", href: "/impressum" },
];

const SOCIAL = [
	{ Icon: GitBranch, href: "#", label: "Repository" },
	{ Icon: MessageCircle, href: "/contact", label: "Contact" },
	{ Icon: Mail, href: "mailto:support@techstore-demo.de", label: "Email" },
];

export function Footer() {
	return (
		<footer className="bg-surface border-t border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Brand */}
					<div className="md:col-span-1">
						<a href="/" className="flex items-center gap-2 mb-4">
							<div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
								<Zap size={16} className="text-accent-foreground" />
							</div>
							<span className="font-bold text-lg text-foreground">
								tech<span className="text-accent">store</span>
							</span>
						</a>
						<p className="text-sm text-muted leading-relaxed mb-4">
							TechStore Demo GmbH is a portfolio tech shop with German-style
							support pages, clear returns, and realistic e-commerce flows.
						</p>
						<div className="flex gap-3">
							{SOCIAL.map(({ Icon, href, label }) => (
								<a
									key={label}
									href={href}
									aria-label={label}
									className="w-9 h-9 rounded-lg bg-default flex items-center justify-center text-muted hover:text-foreground hover:bg-default/80 transition-colors"
								>
									<Icon size={16} />
								</a>
							))}
						</div>
					</div>

					{/* Quick links */}
					<div>
						<h3 className="font-semibold text-foreground mb-4 text-sm">
							Quick Links
						</h3>
						<ul className="space-y-2">
							{QUICK_LINKS.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										className="text-sm text-muted hover:text-foreground transition-colors"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Support */}
					<div>
						<h3 className="font-semibold text-foreground mb-4 text-sm">
							Support
						</h3>
						<ul className="space-y-2">
							{SUPPORT_LINKS.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										className="text-sm text-muted hover:text-foreground transition-colors"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="font-semibold text-foreground mb-4 text-sm">
							Contact
						</h3>
						<ul className="space-y-2 text-sm text-muted">
							<li>TechStore Demo GmbH</li>
							<li>support@techstore-demo.de</li>
							<li>+49 30 5557 1840</li>
							<li>Mon - Fri, 09:00 - 18:00 CET</li>
							<li>Invalidenstrasse 117, 10115 Berlin, Germany</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
					<p>
						© {new Date().getFullYear()} TechStore Demo GmbH. All rights
						reserved.
					</p>
					<div className="flex gap-4">
						<a
							href="/privacy"
							className="hover:text-foreground transition-colors"
						>
							Privacy Policy
						</a>
						<a
							href="/terms"
							className="hover:text-foreground transition-colors"
						>
							Terms of Service
						</a>
						<a
							href="/impressum"
							className="hover:text-foreground transition-colors"
						>
							Impressum
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
