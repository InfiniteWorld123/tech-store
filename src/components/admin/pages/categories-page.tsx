import { Layers } from "lucide-react";
import {
	AdminEmptyState,
	AdminPageHeader,
} from "#/components/admin/sections/admin-page";

export function CategoriesPage() {
	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader
				title="Categories"
				description="Manage product categories"
			/>
			<AdminEmptyState
				icon={Layers}
				message="Category management coming soon."
			/>
		</div>
	);
}
