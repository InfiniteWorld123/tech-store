import { Button, Disclosure } from "@heroui/react";
import { SlidersHorizontal } from "lucide-react";
import { AdminPageHeader } from "#/components/admin/sections/admin-page";
import { ProductStatCards } from "#/components/admin/sections/product-stat-cards";
import { ProductsFilterSidebar } from "#/components/admin/sections/products-filters";
import { ProductsResults } from "#/components/admin/sections/products-view";
import type { ProductsSearch } from "#/queries/products-search";
import type { GetProductsInputType } from "#/server/catalog/products/products.types";

export function ProductsPage({
	queryInput,
	search,
	onFilterApply,
	onFilterReset,
}: {
	queryInput: GetProductsInputType;
	search: ProductsSearch;
	onFilterApply: (formData: FormData) => void;
	onFilterReset: () => void;
}) {
	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader
				title="Products"
				description="Manage your product catalog"
			/>

			<ProductStatCards />

			<div className="lg:hidden">
				<Disclosure>
					<Disclosure.Heading>
						<Button fullWidth slot="trigger" variant="secondary">
							<SlidersHorizontal size={16} />
							Filters
							<Disclosure.Indicator />
						</Button>
					</Disclosure.Heading>
					<Disclosure.Content>
						<Disclosure.Body className="pt-3">
							<ProductsFilterSidebar
								search={search}
								onFilterApply={onFilterApply}
								onFilterReset={onFilterReset}
							/>
						</Disclosure.Body>
					</Disclosure.Content>
				</Disclosure>
			</div>

			<div className="grid min-w-0 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				<aside className="hidden lg:h-[calc(100vh-8rem)] lg:min-h-[520px] lg:block">
					<ProductsFilterSidebar
						className="sticky top-0 h-full"
						search={search}
						onFilterApply={onFilterApply}
						onFilterReset={onFilterReset}
					/>
				</aside>
				<ProductsResults
					className="lg:h-[calc(100vh-8rem)] lg:min-h-[520px]"
					queryInput={queryInput}
				/>
			</div>
		</div>
	);
}
