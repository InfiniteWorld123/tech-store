import { Pagination } from "@heroui/react";

type WindowedPaginationProps = {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	limit: number;
	itemLabel: string;
	onPageChange: (page: number) => void;
	onPrefetchPage: (page: number) => void;
	className?: string;
	showSummaryWhenSinglePage?: boolean;
};

function getPageNumbers(
	currentPage: number,
	totalPages: number,
): Array<number | "ellipsis-start" | "ellipsis-end"> {
	const pages: Array<number | "ellipsis-start" | "ellipsis-end"> = [];

	if (totalPages <= 7) {
		for (let i = 1; i <= totalPages; i++) pages.push(i);
		return pages;
	}

	pages.push(1);
	if (currentPage > 3) pages.push("ellipsis-start");

	const start = Math.max(2, currentPage - 1);
	const end = Math.min(totalPages - 1, currentPage + 1);
	for (let i = start; i <= end; i++) pages.push(i);

	if (currentPage < totalPages - 2) pages.push("ellipsis-end");
	pages.push(totalPages);

	return pages;
}

export function WindowedPagination({
	currentPage,
	totalPages,
	totalItems,
	limit,
	itemLabel,
	onPageChange,
	onPrefetchPage,
	className,
	showSummaryWhenSinglePage = false,
}: WindowedPaginationProps) {
	if (totalItems === 0) return null;

	const displayPage = Math.min(Math.max(currentPage, 1), totalPages);
	const startItem = (displayPage - 1) * limit + 1;
	const endItem = Math.min(displayPage * limit, totalItems);
	const label = `${itemLabel}${totalItems === 1 ? "" : "s"}`;

	if (totalPages <= 1) {
		if (!showSummaryWhenSinglePage) return null;

		return (
			<div className={className}>
				<p className="text-xs text-muted sm:text-sm">
					Showing {startItem}-{endItem} of {totalItems} {label}
				</p>
			</div>
		);
	}

	return (
		<div className={className}>
			<Pagination className="w-full">
				<Pagination.Summary className="text-xs sm:text-sm">
					Showing {startItem}-{endItem} of {totalItems} {label}
				</Pagination.Summary>
				<Pagination.Content className="max-w-full justify-center overflow-x-auto pb-1">
					<Pagination.Item>
						<Pagination.Previous
							isDisabled={displayPage === 1}
							onPress={() => onPageChange(displayPage - 1)}
							onFocus={() => displayPage > 1 && onPrefetchPage(displayPage - 1)}
							onMouseEnter={() =>
								displayPage > 1 && onPrefetchPage(displayPage - 1)
							}
						>
							<Pagination.PreviousIcon />
							<span className="hidden sm:inline">Previous</span>
						</Pagination.Previous>
					</Pagination.Item>

					<Pagination.Item className="sm:hidden">
						<span className="inline-flex h-9 items-center rounded-lg border border-border px-3 text-sm font-medium text-foreground">
							{displayPage} / {totalPages}
						</span>
					</Pagination.Item>

					{getPageNumbers(displayPage, totalPages).map((page) =>
						typeof page !== "number" ? (
							<Pagination.Item key={page} className="hidden sm:list-item">
								<Pagination.Ellipsis />
							</Pagination.Item>
						) : (
							<Pagination.Item key={page} className="hidden sm:list-item">
								<Pagination.Link
									isActive={page === displayPage}
									onPress={() => onPageChange(page)}
									onFocus={() => page !== displayPage && onPrefetchPage(page)}
									onMouseEnter={() =>
										page !== displayPage && onPrefetchPage(page)
									}
								>
									{page}
								</Pagination.Link>
							</Pagination.Item>
						),
					)}

					<Pagination.Item>
						<Pagination.Next
							isDisabled={displayPage >= totalPages}
							onPress={() => onPageChange(displayPage + 1)}
							onFocus={() =>
								displayPage < totalPages && onPrefetchPage(displayPage + 1)
							}
							onMouseEnter={() =>
								displayPage < totalPages && onPrefetchPage(displayPage + 1)
							}
						>
							<span className="hidden sm:inline">Next</span>
							<Pagination.NextIcon />
						</Pagination.Next>
					</Pagination.Item>
				</Pagination.Content>
			</Pagination>
		</div>
	);
}
