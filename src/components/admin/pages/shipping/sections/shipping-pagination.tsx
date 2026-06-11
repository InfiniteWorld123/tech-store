"use client";

import { Pagination } from "@heroui/react";

type ShippingPaginationProps = {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	limit: number;
	onPageChange: (page: number) => void;
};

export function ShippingPagination({
	currentPage,
	totalPages,
	totalItems,
	limit,
	onPageChange,
}: ShippingPaginationProps) {
	const startItem = (currentPage - 1) * limit + 1;
	const endItem = Math.min(currentPage * limit, totalItems);

	const getPageNumbers = (): (number | "ellipsis-start" | "ellipsis-end")[] => {
		const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];

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
	};

	if (totalItems === 0) return null;

	return (
		<div className="pt-4 border-t border-border">
			<Pagination className="w-full">
				<Pagination.Summary>
					Showing {startItem}–{endItem} of {totalItems} shipment
					{totalItems !== 1 ? "s" : ""}
				</Pagination.Summary>
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.Previous
							isDisabled={currentPage === 1}
							onPress={() => onPageChange(currentPage - 1)}
						>
							<Pagination.PreviousIcon />
							<span>Previous</span>
						</Pagination.Previous>
					</Pagination.Item>

					{getPageNumbers().map((p) =>
						typeof p !== "number" ? (
							<Pagination.Item key={p}>
								<Pagination.Ellipsis />
							</Pagination.Item>
						) : (
							<Pagination.Item key={p}>
								<Pagination.Link
									isActive={p === currentPage}
									onPress={() => onPageChange(p)}
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
