import { Alert, Button, Card, Table } from "@heroui/react";
import {
	ClipboardCheck,
	FileCheck,
	HelpCircle,
	Lock,
	MapPin,
	Package,
	PackageCheck,
	RefreshCcw,
	Scale,
	Search,
	ShieldCheck,
	Truck,
	Undo2,
} from "lucide-react";
import { InfoCard, PolicySection } from "#/components/legal/sections/info-card";
import {
	PublicPageLayout,
	ShopCta,
} from "#/components/legal/sections/public-page-layout";
import LinkAnchor from "#/components/ui/buttons/link-anchor";
import { useSession } from "#/lib/auth-client";

const shippingRows = [
	["Germany standard", "DHL GoGreen", "2-4 business days", "4.90 EUR"],
	["Germany express", "DHL Express", "1-2 business days", "9.90 EUR"],
	["EU standard", "DHL / local partner", "4-8 business days", "8.90 EUR"],
	["Orders over 79 EUR", "Germany standard", "2-4 business days", "Free"],
];

export function FaqPage() {
	const faqs = [
		[
			"Is TechStore a real company?",
			"This is a portfolio store, but the shopping, support, legal, and email flows are designed to feel like a real German e-commerce experience.",
		],
		[
			"Which payment methods are supported?",
			"The demo is prepared around secure card payments and checkout flows. Payment details are handled by payment providers, not stored directly by the shop UI.",
		],
		[
			"How fast is shipping?",
			"Germany standard delivery is presented as 2-4 business days, with EU delivery typically shown as 4-8 business days.",
		],
		[
			"Can I return an order?",
			"Yes. The support pages describe a German/EU-style 14-day withdrawal and return process for distance purchases.",
		],
		[
			"Do products have warranty?",
			"The demo copy presents a two-year statutory warranty style, plus support guidance for damaged or incorrect products.",
		],
		[
			"Where can I get help?",
			"Use the Contact page for order questions, returns, warranty requests, or general portfolio demo feedback.",
		],
	];

	return (
		<PublicPageLayout
			eyebrow="Support center"
			title="Frequently asked questions."
			description="Fast answers for orders, shipping, payment, warranty, returns, and account questions."
			icon={HelpCircle}
		>
			<section className="py-16 sm:py-20">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-4">
					{faqs.map(([question, answer]) => (
						<PolicySection key={question} title={question}>
							<p>{answer}</p>
						</PolicySection>
					))}
				</div>
			</section>
			<ShopCta
				title="Still need help?"
				description="Send a message to support or jump back into the store and keep exploring."
			/>
		</PublicPageLayout>
	);
}

export function ShippingPage() {
	return (
		<PublicPageLayout
			eyebrow="Delivery"
			title="Shipping across Germany and the EU."
			description="Clear delivery prices, realistic DHL-style timing, and free standard shipping for larger German orders."
			icon={Truck}
		>
			<section className="py-16 sm:py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<Table>
						<Table.ScrollContainer>
							<Table.Content
								aria-label="Shipping rates"
								className="min-w-[680px]"
							>
								<Table.Header>
									<Table.Column isRowHeader>Region</Table.Column>
									<Table.Column>Carrier</Table.Column>
									<Table.Column>Time</Table.Column>
									<Table.Column>Price</Table.Column>
								</Table.Header>
								<Table.Body>
									{shippingRows.map(([region, carrier, time, price]) => (
										<Table.Row key={region} id={region}>
											<Table.Cell>{region}</Table.Cell>
											<Table.Cell>{carrier}</Table.Cell>
											<Table.Cell>{time}</Table.Cell>
											<Table.Cell>{price}</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table.Content>
						</Table.ScrollContainer>
					</Table>
					<div className="grid md:grid-cols-3 gap-6 mt-8">
						<InfoCard
							icon={PackageCheck}
							title="Packed in 24 hours"
							description="Orders placed before 14:00 CET are prepared the same working day in this demo flow."
						/>
						<InfoCard
							icon={MapPin}
							title="Germany-first"
							description="Delivery copy is written for German customers, with EU shipping shown as a secondary option."
						/>
						<InfoCard
							icon={ShieldCheck}
							title="Tracked delivery"
							description="Every shipped demo order receives a tracking number and delivery status."
						/>
					</div>
				</div>
			</section>
			<ShopCta />
		</PublicPageLayout>
	);
}

export function ReturnsPage() {
	const steps = [
		"Open a return request through Contact or the Returns page.",
		"Pack the product safely with accessories and invoice copy.",
		"Use the demo return label or your preferred tracked carrier.",
		"Refunds are shown as processed within 5-10 business days after inspection.",
	];

	return (
		<PublicPageLayout
			eyebrow="Returns"
			title="Simple returns with a 14-day EU-style window."
			description="A practical portfolio return flow inspired by German distance-selling expectations."
			icon={RefreshCcw}
		>
			<section className="py-16 sm:py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-8">
					<InfoCard
						icon={Undo2}
						title="Return window"
						description="Customers can request withdrawal within 14 days after receiving the goods. Products should be returned complete and handled with reasonable care."
					/>
					<div className="grid gap-4">
						{steps.map((step, index) => (
							<Card key={step} className="flex-row gap-4 p-5">
								<div className="h-9 w-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
									{index + 1}
								</div>
								<p className="text-muted leading-relaxed">{step}</p>
							</Card>
						))}
					</div>
				</div>
			</section>
			<ShopCta
				title="Need to start a return?"
				description="Use the contact form and include your order number so support can help quickly."
			/>
		</PublicPageLayout>
	);
}

export function TrackOrderPage() {
	const { data: sessionData } = useSession();
	const user = sessionData?.user ?? null;

	return (
		<PublicPageLayout
			eyebrow="Order tracking"
			title="Track your TechStore order."
			description="Sign in to view real-time tracking for your orders."
			icon={Search}
		>
			<section className="py-16 sm:py-20">
				<div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
					{user ? (
						<Card className="p-6 sm:p-8 text-center space-y-4">
							<div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
								<Package size={22} className="text-accent" />
							</div>
							<p className="font-bold text-foreground text-lg">
								Hi {user.name}!
							</p>
							<p className="text-sm text-muted">
								View live tracking status for all your orders in My Orders.
							</p>
							<LinkAnchor to="/account/orders">
								<Button variant="primary" className="w-full">
									Go to My Orders
								</Button>
							</LinkAnchor>
						</Card>
					) : (
						<Card className="p-6 sm:p-8 text-center space-y-4">
							<div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center mx-auto">
								<Search size={22} className="text-muted" />
							</div>
							<p className="font-bold text-foreground text-lg">
								Sign in to track your order
							</p>
							<p className="text-sm text-muted">
								Order tracking is available to signed-in customers. Sign in to
								view shipping status, tracking numbers, and delivery updates for
								all your orders.
							</p>
							<LinkAnchor
								to="/sign-in"
								search={{ redirect: "/account/orders" }}
							>
								<Button variant="primary" className="w-full">
									Sign in
								</Button>
							</LinkAnchor>
						</Card>
					)}
				</div>
			</section>
		</PublicPageLayout>
	);
}

export function PrivacyPage() {
	return (
		<PublicPageLayout
			eyebrow="GDPR-style privacy"
			title="Privacy Policy."
			description="Clear portfolio privacy copy for account, order, payment, analytics, and contact form data."
			icon={Lock}
		>
			<PolicyContent>
				<PolicySection title="Controller">
					<p>
						TechStore Demo GmbH, Invalidenstrasse 117, 10115 Berlin, Germany, is
						the demo controller for this portfolio project.
					</p>
				</PolicySection>
				<PolicySection title="Data we process">
					<p>
						We process account data, order details, delivery addresses, payment
						references, support messages, technical logs, and basic analytics
						data needed to run the shop experience.
					</p>
				</PolicySection>
				<PolicySection title="Contact form">
					<p>
						Messages sent through Contact are emailed to support and used only
						to answer the request. The customer email is used as reply-to.
					</p>
				</PolicySection>
				<PolicySection title="Payments">
					<p>
						Payment details are handled by external payment providers. TechStore
						stores payment references and order status, not full card details.
					</p>
				</PolicySection>
				<PolicySection title="Cookies and analytics">
					<p>
						Essential cookies keep the shop working. Optional analytics or
						marketing cookies should only be enabled with consent in a
						production version.
					</p>
				</PolicySection>
				<PolicySection title="Your rights">
					<p>
						Users may request access, correction, deletion, restriction,
						portability, or objection, and may contact a German supervisory
						authority.
					</p>
				</PolicySection>
			</PolicyContent>
		</PublicPageLayout>
	);
}

export function TermsPage() {
	return (
		<PublicPageLayout
			eyebrow="AGB-style terms"
			title="Terms of Service."
			description="Plain English terms that make the portfolio shop feel complete and commercially realistic."
			icon={Scale}
		>
			<PolicyContent>
				<PolicySection title="Scope">
					<p>
						These terms apply to demo purchases through TechStore Demo GmbH. The
						text is portfolio content and not legal advice.
					</p>
				</PolicySection>
				<PolicySection title="Orders and contract">
					<p>
						Products shown in the store are invitations to order. A contract is
						represented as accepted after checkout confirmation and order email.
					</p>
				</PolicySection>
				<PolicySection title="Prices and payment">
					<p>
						Prices are shown in EUR including VAT-style presentation where
						applicable. Payment is processed through secure external providers.
					</p>
				</PolicySection>
				<PolicySection title="Delivery">
					<p>
						Delivery times are estimates. Customers receive tracking details
						after shipment, and delays are communicated through support.
					</p>
				</PolicySection>
				<PolicySection title="Returns and withdrawal">
					<p>
						Consumers may use the 14-day withdrawal process described in the
						Withdrawal and Returns pages.
					</p>
				</PolicySection>
				<PolicySection title="Warranty and liability">
					<p>
						German statutory warranty concepts are reflected in the demo copy.
						Liability is limited only as permitted by applicable law in a real
						shop.
					</p>
				</PolicySection>
			</PolicyContent>
		</PublicPageLayout>
	);
}

export function ImpressumPage() {
	return (
		<PublicPageLayout
			eyebrow="German legal notice"
			title="Impressum."
			description="Believable placeholder business details for a German portfolio e-commerce store."
			icon={FileCheck}
		>
			<PolicyContent>
				<PolicySection title="Provider">
					<p>
						TechStore Demo GmbH
						<br />
						Invalidenstrasse 117
						<br />
						10115 Berlin
						<br />
						Germany
					</p>
				</PolicySection>
				<PolicySection title="Contact">
					<p>
						Email: support@techstore-demo.de
						<br />
						Phone: +49 30 5557 1840
					</p>
				</PolicySection>
				<PolicySection title="Represented by">
					<p>Yaman Warda, Managing Director Demo</p>
				</PolicySection>
				<PolicySection title="Registration and VAT">
					<p>
						Commercial register: Amtsgericht Berlin-Charlottenburg, HRB 000000 B
						<br />
						VAT ID: DE000000000
					</p>
				</PolicySection>
				<PolicySection title="Responsible for content">
					<p>Yaman Warda, Invalidenstrasse 117, 10115 Berlin, Germany.</p>
				</PolicySection>
				<PolicySection title="Portfolio note">
					<p>
						This Impressum is fake demo content for a portfolio project and must
						be replaced before running a real shop.
					</p>
				</PolicySection>
			</PolicyContent>
		</PublicPageLayout>
	);
}

export function WithdrawalPage() {
	return (
		<PublicPageLayout
			eyebrow="Widerrufsrecht"
			title="Right of Withdrawal."
			description="A clear EU/Germany-style withdrawal page for distance purchases."
			icon={ClipboardCheck}
		>
			<PolicyContent>
				<PolicySection title="Right to withdraw">
					<p>
						Consumers may withdraw from a distance purchase within 14 days
						without giving a reason. The period begins when the customer or a
						nominated person receives the goods.
					</p>
				</PolicySection>
				<PolicySection title="How to withdraw">
					<p>
						Send a clear statement by email or contact form to TechStore Demo
						GmbH, support@techstore-demo.de, before the withdrawal period
						expires.
					</p>
				</PolicySection>
				<PolicySection title="Effects of withdrawal">
					<p>
						After valid withdrawal, payments including standard delivery costs
						are refunded within 14 days, using the original payment method where
						possible.
					</p>
				</PolicySection>
				<PolicySection title="Returning goods">
					<p>
						Goods should be returned without undue delay and no later than 14
						days after declaring withdrawal. Customers may bear direct return
						costs in this demo policy.
					</p>
				</PolicySection>
				<PolicySection title="Sample withdrawal form">
					<p>
						I/we hereby withdraw from the contract for the purchase of the
						following goods: [product], ordered on [date], received on [date],
						name and address of consumer, date.
					</p>
				</PolicySection>
			</PolicyContent>
		</PublicPageLayout>
	);
}

function PolicyContent({ children }: { children: React.ReactNode }) {
	return (
		<section className="py-16 sm:py-20">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
				<Alert status="warning">
					<Alert.Indicator />
					<Alert.Content>
						<Alert.Description>
							This is realistic portfolio copy, not legal advice. Replace it
							with lawyer-reviewed text before using a real shop.
						</Alert.Description>
					</Alert.Content>
				</Alert>
				{children}
			</div>
		</section>
	);
}
