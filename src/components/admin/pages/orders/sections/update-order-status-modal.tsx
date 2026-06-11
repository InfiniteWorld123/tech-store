import { Button, Modal } from "@heroui/react";
import { Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useUpdateOrderStatus } from "#/mutations/orders/use-update-order-status";
import type { OrderListItem, OrderStatus } from "../orders.types";

type UpdateOrderStatusModalProps = {
	item: OrderListItem | null;
	onClose: () => void;
};

const NEXT_STATUSES: Record<string, OrderStatus[]> = {
	pending: ["processing", "cancelled"],
	processing: ["completed", "cancelled"],
	completed: [],
	cancelled: [],
};

const STATUS_LABELS: Record<OrderStatus, string> = {
	pending: "Pending",
	processing: "Processing",
	completed: "Completed",
	cancelled: "Cancelled",
};

export function UpdateOrderStatusModal({
	item,
	onClose,
}: UpdateOrderStatusModalProps) {
	const [selectedStatus, setSelectedStatus] =
		useState<OrderStatus>("processing");
	const updateOrderStatus = useUpdateOrderStatus({ onSuccess: onClose });

	useEffect(() => {
		if (item) {
			const next = NEXT_STATUSES[item.status];
			if (next.length > 0) setSelectedStatus(next[0]);
		}
	}, [item]);

	const nextStatuses = item ? NEXT_STATUSES[item.status] : [];
	const isTerminal = nextStatuses.length === 0;

	return (
		<Modal.Root
			isOpen={item !== null}
			onOpenChange={(open) => !open && onClose()}
		>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog>
						<Modal.Header>
							<Modal.Heading className="text-base font-semibold text-foreground">
								Update Order Status
							</Modal.Heading>
							<Modal.CloseTrigger className="text-muted hover:text-foreground">
								<X size={18} />
							</Modal.CloseTrigger>
						</Modal.Header>

						<Modal.Body className="space-y-4">
							{isTerminal ? (
								<div className="flex items-center gap-2.5 p-3 rounded-xl bg-default/50">
									<Info size={15} className="text-muted flex-shrink-0" />
									<p className="text-sm text-muted">
										This order status is final and cannot be changed.
									</p>
								</div>
							) : (
								<div className="flex flex-col gap-1.5">
									<label
										htmlFor="order-status-select"
										className="text-sm font-medium text-foreground"
									>
										New Status
									</label>
									<select
										id="order-status-select"
										value={selectedStatus}
										onChange={(e) =>
											setSelectedStatus(e.target.value as OrderStatus)
										}
										className="w-full appearance-none px-3 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all cursor-pointer"
									>
										{nextStatuses.map((s) => (
											<option key={s} value={s}>
												{STATUS_LABELS[s]}
											</option>
										))}
									</select>
								</div>
							)}
						</Modal.Body>

						<Modal.Footer className="gap-2">
							<Button variant="outline" size="sm" onPress={onClose}>
								Cancel
							</Button>
							<Button
								variant="primary"
								size="sm"
								isDisabled={isTerminal || !item}
								isPending={updateOrderStatus.isPending}
								onPress={() =>
									item &&
									updateOrderStatus.mutate({
										orderId: item.id,
										orderStatus: selectedStatus,
									})
								}
							>
								Update Status
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal.Root>
	);
}
