import { WindowedPagination } from "#/components/ui/pagination/windowed-pagination";

type OrdersPaginationProps = {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	limit: number;
	onPageChange: (page: number) => void;
	onPrefetchPage: (page: number) => void;
};

export function OrdersPagination({
	currentPage,
	totalPages,
	totalItems,
	limit,
	onPageChange,
	onPrefetchPage,
}: OrdersPaginationProps) {
	return (
		<WindowedPagination
			currentPage={currentPage}
			totalPages={totalPages}
			totalItems={totalItems}
			limit={limit}
			itemLabel="order"
			onPageChange={onPageChange}
			onPrefetchPage={onPrefetchPage}
			className="border-t border-border pt-4"
			showSummaryWhenSinglePage
		/>
	);
}
