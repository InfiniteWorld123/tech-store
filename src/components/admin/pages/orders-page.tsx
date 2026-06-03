import { ShoppingBag } from "lucide-react";
import {
	AdminEmptyState,
	AdminPageHeader,
} from "#/components/admin/sections/admin-page";

export function OrdersPage() {
	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader title="Orders" description="Manage customer orders" />
			<AdminEmptyState
				icon={ShoppingBag}
				message="Order management coming soon."
			/>
		</div>
	);
}
