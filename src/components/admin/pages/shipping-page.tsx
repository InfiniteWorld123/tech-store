import { Truck } from "lucide-react";
import {
	AdminEmptyState,
	AdminPageHeader,
} from "#/components/admin/sections/admin-page";

export function ShippingPage() {
	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader
				title="Shipping"
				description="Track shipments and deliveries"
			/>
			<AdminEmptyState
				icon={Truck}
				message="Shipping management coming soon."
			/>
		</div>
	);
}
