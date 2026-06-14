import { Button, Form, Modal } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { getAdminFieldError } from "#/components/admin/ui/admin-form-errors";
import { InputField } from "#/components/ui/fields/input-field";
import { useMarkOrderShipped } from "#/mutations/shipping/use-mark-order-shipped";
import type { ShippingListItem } from "../shipping.types";

type Props = {
	item: ShippingListItem | null;
	onClose: () => void;
};

const markShippedSchema = z.object({
	orderId: z.uuid("Order id must be valid"),
	trackingNumber: z.string().trim().min(1, "Tracking number is required"),
});

export function MarkShippedModal({ item, onClose }: Props) {
	const markShipped = useMarkOrderShipped();
	const form = useForm({
		defaultValues: {
			orderId: "",
			trackingNumber: "",
		},
		validators: {
			onSubmit: markShippedSchema,
		},
		onSubmit: async ({ value }) => {
			await markShipped.mutateAsync({
				orderId: value.orderId,
				trackingNumber: value.trackingNumber.trim(),
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
		setFieldValue("trackingNumber", item.trackingNumber ?? "");
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
									Mark as Shipped
								</Modal.Heading>
								<Modal.CloseTrigger className="text-muted hover:text-foreground">
									<X size={18} />
								</Modal.CloseTrigger>
							</Modal.Header>

							<Modal.Body className="space-y-4">
								<p className="text-sm text-muted">
									Enter the tracking number for this shipment. The shipped
									timestamp will be recorded automatically.
								</p>
								<Field name="trackingNumber">
									{(field) => (
										<InputField
											label="Tracking Number"
											placeholder="e.g. 1Z999AA1012345678"
											value={field.state.value}
											onChange={(value) => field.handleChange(value)}
											onBlur={field.handleBlur}
											errorText={getAdminFieldError(field, form)}
										/>
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
												Mark as Shipped
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
