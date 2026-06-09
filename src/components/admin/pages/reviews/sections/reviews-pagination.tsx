import { Pagination } from "@heroui/react";

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
	onPrefetchPage
}: ReviewsPaginationProps) {
	const startItem = (currentPage - 1) * limit + 1;
	const endItem = Math.min(currentPage * limit, totalItems);

	const getPageNumbers = (): (number | "ellipsis")[] => {
		const pages: (number | "ellipsis")[] = [];

		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
			return pages;
		}

		pages.push(1);
		if (currentPage > 3) pages.push("ellipsis");

		const start = Math.max(2, currentPage - 1);
		const end = Math.min(totalPages - 1, currentPage + 1);
		for (let i = start; i <= end; i++) pages.push(i);

		if (currentPage < totalPages - 2) pages.push("ellipsis");
		pages.push(totalPages);

		return pages;
	};

	return (
		<div className="pt-4 border-t border-border">
			<Pagination className="w-full">
				<Pagination.Summary>
					Showing {startItem}–{endItem} of {totalItems} reviews
				</Pagination.Summary>
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.Previous
							isDisabled={currentPage === 1}
							onPress={() => onPageChange(currentPage - 1)}
							onMouseEnter={() => currentPage > 1 && onPrefetchPage(currentPage - 1)}
						>
							<Pagination.PreviousIcon />
							<span>Previous</span>
						</Pagination.Previous>
					</Pagination.Item>

					{getPageNumbers().map((p, i) =>
						p === "ellipsis" ? (
							<Pagination.Item key={`ellipsis-${i}`}>
								<Pagination.Ellipsis />
							</Pagination.Item>
						) : (
							<Pagination.Item key={p}>
								<Pagination.Link
									isActive={p === currentPage}
									onPress={() => onPageChange(p)}
									onMouseEnter={() => p !== currentPage && onPrefetchPage(p)}
								>
									{p}
								</Pagination.Link>
							</Pagination.Item>
						),
					)}

					<Pagination.Item>
						<Pagination.Next
							isDisabled={currentPage >= totalPages}
							onPress={() => onPageChange(currentPage + 1)}
							onMouseEnter={() => currentPage < totalPages && onPrefetchPage(currentPage + 1)}
						>
							<span>Next</span>
							<Pagination.NextIcon />
						</Pagination.Next>
					</Pagination.Item>
				</Pagination.Content>
			</Pagination>
		</div>
	);
}
