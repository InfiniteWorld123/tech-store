import { Button, Modal } from "@heroui/react";
import { X } from "lucide-react";
import type { AdminOrderListItemType } from "#/server/orders/admin/admin.types";

type ArchiveOrderDialogProps = {
	item: AdminOrderListItemType | null;
	onClose: () => void;
};

export function ArchiveOrderDialog({ item, onClose }: ArchiveOrderDialogProps) {
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
								Archive Order
							</Modal.Heading>
							<Modal.CloseTrigger className="text-muted hover:text-foreground">
								<X size={18} />
							</Modal.CloseTrigger>
						</Modal.Header>

						<Modal.Body>
							<p className="text-sm text-muted">
								Are you sure you want to archive order{" "}
								<span className="font-semibold text-foreground">
									{item?.orderNumber}
								</span>
								? It will be removed from the active orders list.
							</p>
						</Modal.Body>

						<Modal.Footer className="gap-2">
							<Button variant="outline" size="sm" onPress={onClose}>
								Cancel
							</Button>
							<Button
								variant="danger"
								size="sm"
								onPress={onClose}
								// TODO: replace onPress with useArchiveOrder({ onSuccess: onClose }).mutate({ orderId: item.id })
							>
								Archive
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal.Root>
	);
}
