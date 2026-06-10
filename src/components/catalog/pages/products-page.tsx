import { Card } from "@heroui/react";
import { PackageSearch } from "lucide-react";
import { Footer } from "#/components/layout/footer";
import { Header } from "#/components/layout/header";

export function ProductsPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 pt-24 pb-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Page header */}
					<div className="mb-10">
						<p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
							Catalog
						</p>
						<h1 className="text-3xl sm:text-4xl font-bold text-foreground">
							All Products
						</h1>
						<p className="mt-2 text-muted text-base max-w-xl">
							Browse the full range of tech — laptops, phones, audio and more.
						</p>
					</div>

					<Card className="items-center border-dashed px-6 py-16 text-center">
						<PackageSearch size={28} className="text-muted" />
						<Card.Header className="items-center">
							<Card.Title className="text-base">Coming soon</Card.Title>
							<Card.Description className="max-w-md">
								The product listing is on its way. In the meantime, explore by
								category.
							</Card.Description>
						</Card.Header>
					</Card>
				</div>
			</main>

			<Footer />
		</div>
	);
}
