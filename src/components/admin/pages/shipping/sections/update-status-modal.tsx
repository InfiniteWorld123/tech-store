import { Button, Form, Modal } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { getAdminFieldError } from "#/components/admin/ui/admin-form-errors";
import { useUpdateShippingStatus } from "#/mutations/shipping/use-update-shipping-status";
import type { ShippingListItem, ShippingStatus } from "../shipping.types";

type Props = {
	item: ShippingListItem | null;
	onClose: () => void;
};

const statusLabels: Record<ShippingStatus, string> = {
	pending: "Pending",
	packed: "Packed",
	shipped: "Shipped",
	in_transit: "In Transit",
	delivered: "Delivered",
};

const ALL_STATUSES = [
	"pending",
	"packed",
	"shipped",
	"in_transit",
	"delivered",
] as const;

const updateStatusSchema = z.object({
	orderId: z.uuid("Order id must be valid"),
	shippingStatus: z.enum(ALL_STATUSES),
});

export function UpdateStatusModal({ item, onClose }: Props) {
	const updateStatus = useUpdateShippingStatus();
	const form = useForm({
		defaultValues: {
			orderId: "",
			shippingStatus: "pending" as ShippingStatus,
		},
		validators: {
			onSubmit: updateStatusSchema,
		},
		onSubmit: async ({ value }) => {
			await updateStatus.mutateAsync({
				orderId: value.orderId,
				shippingStatus: value.shippingStatus,
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
		setFieldValue("orderId", item.orderId);
		setFieldValue("shippingStatus", item.status);
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
									Update Status
								</Modal.Heading>
								<Modal.CloseTrigger className="text-muted hover:text-foreground">
									<X size={18} />
								</Modal.CloseTrigger>
							</Modal.Header>

							<Modal.Body className="space-y-4">
								<Field name="shippingStatus">
									{(field) => (
										<label className="flex flex-col gap-1.5">
											<span className="text-sm font-medium text-foreground">
												New Status
											</span>
											<select
												value={field.state.value}
												onChange={(event) =>
													field.handleChange(
														event.target.value as ShippingStatus,
													)
												}
												className="w-full cursor-pointer appearance-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
											>
												{ALL_STATUSES.map((status) => (
													<option key={status} value={status}>
														{statusLabels[status]}
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
												isPending={isSubmitting}
												isDisabled={isSubmitting}
											>
												Save Status
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
