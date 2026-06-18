import { WindowedPagination } from "#/components/ui/pagination/windowed-pagination";

type ReviewsPaginationProps = {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	limit: number;
	onPageChange: (page: number) => void;
	onPrefetchPage: (page: number) => void;
};

export function ReviewsPagination({
	currentPage,
	totalPages,
	totalItems,
	limit,
	onPageChange,
	onPrefetchPage,
}: ReviewsPaginationProps) {
	return (
		<WindowedPagination
			currentPage={currentPage}
			totalPages={totalPages}
			totalItems={totalItems}
			limit={limit}
			itemLabel="review"
			onPageChange={onPageChange}
			onPrefetchPage={onPrefetchPage}
			className="border-t border-border pt-4"
			showSummaryWhenSinglePage
		/>
	);
}
