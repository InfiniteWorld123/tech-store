"use client";

import { WindowedPagination } from "#/components/ui/pagination/windowed-pagination";

type ShippingPaginationProps = {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	limit: number;
	onPageChange: (page: number) => void;
	onPrefetchPage: (page: number) => void;
};

export function ShippingPagination({
	currentPage,
	totalPages,
	totalItems,
	limit,
	onPageChange,
	onPrefetchPage,
}: ShippingPaginationProps) {
	return (
		<WindowedPagination
			currentPage={currentPage}
			totalPages={totalPages}
			totalItems={totalItems}
			limit={limit}
			itemLabel="shipment"
			onPageChange={onPageChange}
			onPrefetchPage={onPrefetchPage}
			className="border-t border-border pt-4"
			showSummaryWhenSinglePage
		/>
	);
}
