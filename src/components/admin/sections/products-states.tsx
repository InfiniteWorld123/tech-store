import { Skeleton } from "@heroui/react";
import { PackageSearch } from "lucide-react";
import {
	AdminCardGridSkeleton,
	AdminEmptyState,
	AdminListSkeleton,
	AdminSectionError,
	AdminTableSkeleton,
} from "./admin-page";

export function ProductsResultsSkeleton({
	className = "",
}: {
	className?: string;
}) {
	return (
		<div className={`flex min-w-0 flex-col gap-3 lg:min-h-0 ${className}`}>
			<div className="shrink-0 rounded-2xl border border-border bg-surface p-2 shadow-sm">
				<div className="flex flex-col gap-2 xl:flex-row xl:items-center">
					<div className="grid min-w-0 flex-1 grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_8rem_10rem]">
						<Skeleton className="h-8 rounded-lg" />
						<Skeleton className="h-8 rounded-lg" />
						<Skeleton className="h-8 rounded-lg" />
					</div>
					<div className="flex gap-2">
						<Skeleton className="size-8 rounded-lg" />
						<Skeleton className="size-8 rounded-lg" />
						<Skeleton className="size-8 rounded-lg" />
						<Skeleton className="h-8 w-28 rounded-lg" />
					</div>
				</div>
			</div>
			<ProductsTableSkeleton />
			<Skeleton className="h-16 shrink-0 rounded-2xl" />
		</div>
	);
}

export function ProductsTableSkeleton({ count = 7 }: { count?: number }) {
	return <AdminTableSkeleton count={count} />;
}

export function ProductsListSkeleton({ count = 5 }: { count?: number }) {
	return <AdminListSkeleton count={count} />;
}

export function ProductsCardGridSkeleton({ count = 6 }: { count?: number }) {
	return <AdminCardGridSkeleton count={count} />;
}

export function ProductsEmptyState() {
	return (
		<AdminEmptyState
			icon={PackageSearch}
			title="No products found"
			message="No products match the current product list query."
		/>
	);
}

export function ProductsErrorState({ onRetry }: { onRetry?: () => void }) {
	return (
		<AdminSectionError
			title="Products failed to load"
			message="The product list could not be loaded. Try again or check the server logs."
			actionLabel="Retry"
			onAction={onRetry}
		/>
	);
}
