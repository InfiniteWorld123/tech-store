"use client";

import { WindowedPagination } from "#/components/ui/pagination/windowed-pagination";

type PaymentsPaginationProps = {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	limit: number;
	onPageChange: (page: number) => void;
	onPrefetchPage: (page: number) => void;
};

export function PaymentsPagination({
	currentPage,
	totalPages,
	totalItems,
	limit,
	onPageChange,
	onPrefetchPage,
}: PaymentsPaginationProps) {
	return (
		<WindowedPagination
			currentPage={currentPage}
			totalPages={totalPages}
			totalItems={totalItems}
			limit={limit}
			itemLabel="payment"
			onPageChange={onPageChange}
			onPrefetchPage={onPrefetchPage}
			className="border-t border-border pt-4"
			showSummaryWhenSinglePage
		/>
	);
}
