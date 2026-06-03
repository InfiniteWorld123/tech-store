import { Users } from "lucide-react";
import {
	AdminEmptyState,
	AdminPageHeader,
} from "#/components/admin/sections/admin-page";

export function CustomersPage() {
	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader
				title="Customers"
				description="Manage registered customers"
			/>
			<AdminEmptyState
				icon={Users}
				message="Customer management coming soon."
			/>
		</div>
	);
}
