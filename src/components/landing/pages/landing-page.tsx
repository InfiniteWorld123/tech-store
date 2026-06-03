import { Footer } from "#/components/layout/footer";
import { Header } from "#/components/layout/header";
import { BestsellersSection } from "../sections/bestsellers-section";
import { CategoriesSection } from "../sections/categories-section";
import { FeaturedProductsSection } from "../sections/featured-products-section";
import { HeroSection } from "../sections/hero-section";
import { TrustSection } from "../sections/trust-section";

export function LandingPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">
				<HeroSection />
				<CategoriesSection />
				<FeaturedProductsSection />
				<BestsellersSection />
				<TrustSection />
			</main>
			<Footer />
		</div>
	);
}
