import { Card } from "@heroui/react";
import { Tags } from "lucide-react";
import { CategoryCard } from "#/components/landing/ui/category-card";
import { Footer } from "#/components/layout/footer";
import { Header } from "#/components/layout/header";

const MOCK_CATEGORIES = [
	{
		id: "1",
		name: "Laptops",
		slug: "laptops",
		image: null,
		createdAt: "",
		updatedAt: "",
	},
	{
		id: "2",
		name: "Smartphones",
		slug: "smartphones",
		image: null,
		createdAt: "",
		updatedAt: "",
	},
	{
		id: "3",
		name: "Tablets",
		slug: "tablets",
		image: null,
		createdAt: "",
		updatedAt: "",
	},
	{
		id: "4",
		name: "Audio",
		slug: "audio",
		image: null,
		createdAt: "",
		updatedAt: "",
	},
	{
		id: "5",
		name: "Accessories",
		slug: "accessories",
		image: null,
		createdAt: "",
		updatedAt: "",
	},
	{
		id: "6",
		name: "Gaming",
		slug: "gaming",
		image: null,
		createdAt: "",
		updatedAt: "",
	},
];

export function CategoriesPage() {
	const hasCategories = MOCK_CATEGORIES.length > 0;

	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 pt-24 pb-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Page header */}
					<div className="mb-10">
						<p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
							Explore
						</p>
						<h1 className="text-3xl sm:text-4xl font-bold text-foreground">
							Browse Categories
						</h1>
						<p className="mt-2 text-muted text-base max-w-xl">
							Find exactly what you're looking for — shop by product category.
						</p>
					</div>

					{/* Grid */}
					{hasCategories ? (
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
							{MOCK_CATEGORIES.map((category) => (
								<CategoryCard key={category.id} category={category} />
							))}
						</div>
					) : (
						<Card className="items-center border-dashed px-6 py-16 text-center">
							<Tags size={28} className="text-muted" />
							<Card.Header className="items-center">
								<Card.Title className="text-base">No categories yet</Card.Title>
								<Card.Description className="max-w-md">
									There are no categories available right now. Check back soon.
								</Card.Description>
							</Card.Header>
						</Card>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
}
