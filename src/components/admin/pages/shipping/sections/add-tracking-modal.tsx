import { Button, Modal } from "@heroui/react";
import { X } from "lucide-react";
import { useState } from "react";
import type { ShippingListItemType } from "#/server/shipping/shipping.types";

type Props = {
	item: ShippingListItemType | null;
	onClose: () => void;
};

export function AddTrackingModal({ item, onClose }: Props) {
	const [trackingNumber, setTrackingNumber] = useState("");

	const handleClose = () => {
		setTrackingNumber("");
		onClose();
	};

	return (
		<Modal.Root
			isOpen={item !== null}
			onOpenChange={(open) => !open && handleClose()}
		>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog>
						<Modal.Header>
							<Modal.Heading className="text-base font-semibold text-foreground">
								Add Tracking Number
							</Modal.Heading>
							<Modal.CloseTrigger className="text-muted hover:text-foreground">
								<X size={18} />
							</Modal.CloseTrigger>
						</Modal.Header>

						<Modal.Body className="space-y-4">
							<div className="flex flex-col gap-1.5">
								<label
									htmlFor="add-tracking"
									className="text-sm font-medium text-foreground"
								>
									Tracking Number
								</label>
								<input
									id="add-tracking"
									type="text"
									value={trackingNumber}
									onChange={(e) => setTrackingNumber(e.target.value)}
									placeholder="e.g. 1Z999AA1012345678"
									className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
								/>
							</div>
						</Modal.Body>

						<Modal.Footer className="gap-2">
							<Button variant="outline" size="sm" onPress={handleClose}>
								Cancel
							</Button>
							<Button
								variant="primary"
								size="sm"
								isDisabled={!trackingNumber.trim()}
								onPress={handleClose}
							>
								Save
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal.Root>
	);
}
