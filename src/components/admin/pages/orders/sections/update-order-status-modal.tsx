import { Button, Form, Modal } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { Info, X } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { getAdminFieldError } from "#/components/admin/ui/admin-form-errors";
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

const orderStatusSchema = z.object({
	orderId: z.uuid("Order id must be valid"),
	orderStatus: z.enum(["pending", "processing", "completed", "cancelled"]),
});

export function UpdateOrderStatusModal({
	item,
	onClose,
}: UpdateOrderStatusModalProps) {
	const updateOrderStatus = useUpdateOrderStatus();
	const form = useForm({
		defaultValues: {
			orderId: "",
			orderStatus: "processing" as OrderStatus,
		},
		validators: {
			onSubmit: orderStatusSchema,
		},
		onSubmit: async ({ value }) => {
			await updateOrderStatus.mutateAsync({
				orderId: value.orderId,
				orderStatus: value.orderStatus,
			});
			onClose();
		},
	});
	const { Field, Subscribe, handleSubmit, reset, setFieldValue } = form;

	useEffect(() => {
		if (!item) {
			reset();
			return;
		}
		const next = NEXT_STATUSES[item.status];
		setFieldValue("orderId", item.id);
		setFieldValue("orderStatus", next[0] ?? item.status);
	}, [item, reset, setFieldValue]);

	const nextStatuses = item ? NEXT_STATUSES[item.status] : [];
	const isTerminal = nextStatuses.length === 0;

	function handleClose() {
		reset();
		onClose();
	}

	return (
		<Modal.Root
			isOpen={item !== null}
			onOpenChange={(open) => !open && handleClose()}
		>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog>
						<Form
							onSubmit={(event) => {
								event.preventDefault();
								event.stopPropagation();
								handleSubmit();
							}}
						>
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
									<div className="flex items-center gap-2.5 rounded-xl bg-default/50 p-3">
										<Info size={15} className="flex-shrink-0 text-muted" />
										<p className="text-sm text-muted">
											This order status is final and cannot be changed.
										</p>
									</div>
								) : (
									<Field name="orderStatus">
										{(field) => (
											<label className="flex flex-col gap-1.5">
												<span className="text-sm font-medium text-foreground">
													New Status
												</span>
												<select
													value={field.state.value}
													onChange={(event) =>
														field.handleChange(
															event.target.value as OrderStatus,
														)
													}
													className="w-full cursor-pointer appearance-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
												>
													{nextStatuses.map((status) => (
														<option key={status} value={status}>
															{STATUS_LABELS[status]}
														</option>
													))}
												</select>
												{getAdminFieldError(field, form) ? (
													<span className="text-xs text-danger">
														{getAdminFieldError(field, form)}
													</span>
												) : null}
											</label>
										)}
									</Field>
								)}
							</Modal.Body>

							<Modal.Footer className="gap-2">
								<Subscribe>
									{({ isSubmitting }) => (
										<>
											<Button
												variant="outline"
												size="sm"
												onPress={handleClose}
												isDisabled={isSubmitting}
											>
												Cancel
											</Button>
											<Button
												type="submit"
												variant="primary"
												size="sm"
												isDisabled={isTerminal || !item || isSubmitting}
												isPending={isSubmitting}
											>
												Update Status
											</Button>
										</>
									)}
								</Subscribe>
							</Modal.Footer>
						</Form>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal.Root>
	);
}
