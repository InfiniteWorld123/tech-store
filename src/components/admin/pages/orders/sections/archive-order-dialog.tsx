import { Button, Form, Modal } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { Archive, X } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { getAdminFieldError } from "#/components/admin/ui/admin-form-errors";
import { useArchiveOrder } from "#/mutations/orders/use-archive-order";
import type { OrderListItem } from "../orders.types";

type ArchiveOrderDialogProps = {
	item: OrderListItem | null;
	onClose: () => void;
};

const archiveOrderSchema = z.object({
	orderId: z.uuid("Order id must be valid"),
	confirmed: z
		.boolean()
		.refine((value) => value, "Confirm archive before saving"),
});

export function ArchiveOrderDialog({ item, onClose }: ArchiveOrderDialogProps) {
	const archiveOrder = useArchiveOrder();
	const form = useForm({
		defaultValues: {
			orderId: "",
			confirmed: false,
		},
		validators: {
			onSubmit: archiveOrderSchema,
		},
		onSubmit: async ({ value }) => {
			await archiveOrder.mutateAsync({ orderId: value.orderId });
			onClose();
		},
	});
	const { Field, Subscribe, handleSubmit, reset, setFieldValue } = form;

	useEffect(() => {
		if (!item) {
			reset();
			return;
		}
		setFieldValue("orderId", item.id);
		setFieldValue("confirmed", false);
	}, [item, reset, setFieldValue]);

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
									Archive Order
								</Modal.Heading>
								<Modal.CloseTrigger className="text-muted hover:text-foreground">
									<X size={18} />
								</Modal.CloseTrigger>
							</Modal.Header>

							<Modal.Body className="space-y-4">
								<p className="text-sm text-muted">
									Archive order{" "}
									<span className="font-semibold text-foreground">
										{item?.orderNumber}
									</span>
									? It will be removed from the active orders list.
								</p>
								<Field name="confirmed">
									{(field) => (
										<label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-default/30 p-3">
											<input
												type="checkbox"
												checked={field.state.value}
												onChange={(event) =>
													field.handleChange(event.target.checked)
												}
												className="size-4 accent-[var(--accent)]"
											/>
											<Archive
												size={16}
												className={
													field.state.value ? "text-danger" : "text-muted"
												}
											/>
											<span className="text-sm font-medium text-foreground">
												Confirm archive
											</span>
											{getAdminFieldError(field, form) ? (
												<span className="ml-auto text-xs text-danger">
													{getAdminFieldError(field, form)}
												</span>
											) : null}
										</label>
									)}
								</Field>
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
												variant="danger"
												size="sm"
												isDisabled={!item || isSubmitting}
												isPending={isSubmitting}
											>
												Archive
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
