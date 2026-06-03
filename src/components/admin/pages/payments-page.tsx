import { CreditCard } from "lucide-react";
import {
	AdminEmptyState,
	AdminPageHeader,
} from "#/components/admin/sections/admin-page";

export function PaymentsPage() {
	return (
		<div className="flex flex-col gap-6">
			<AdminPageHeader
				title="Payments"
				description="Track and manage payments"
			/>
			<AdminEmptyState
				icon={CreditCard}
				message="Payment management coming soon."
			/>
		</div>
	);
}
