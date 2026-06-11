import { Button, Modal } from "@heroui/react";
import { X } from "lucide-react";
import { useState } from "react";
import type { ShippingCarrier, ShippingMethod } from "../shipping.types";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

export function CreateShipmentModal({ isOpen, onClose }: Props) {
	const [orderId, setOrderId] = useState("");
	const [carrier, setCarrier] = useState<ShippingCarrier>("dhl");
	const [method, setMethod] = useState<ShippingMethod>("standard");

	const handleClose = () => {
		setOrderId("");
		setCarrier("dhl");
		setMethod("standard");
		onClose();
	};

	return (
		<Modal.Root isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog>
						<Modal.Header>
							<Modal.Heading className="text-base font-semibold text-foreground">
								New Shipment
							</Modal.Heading>
							<Modal.CloseTrigger className="text-muted hover:text-foreground">
								<X size={18} />
							</Modal.CloseTrigger>
						</Modal.Header>

						<Modal.Body className="space-y-4">
							<div className="flex flex-col gap-1.5">
								<label
									htmlFor="create-order-id"
									className="text-sm font-medium text-foreground"
								>
									Order ID
								</label>
								<input
									id="create-order-id"
									type="text"
									value={orderId}
									onChange={(e) => setOrderId(e.target.value)}
									placeholder="e.g. 018e1234-abcd-…"
									className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
								/>
							</div>

							<div className="flex flex-col gap-1.5">
								<label
									htmlFor="create-carrier"
									className="text-sm font-medium text-foreground"
								>
									Carrier
								</label>
								<select
									id="create-carrier"
									value={carrier}
									onChange={(e) =>
										setCarrier(e.target.value as ShippingCarrier)
									}
									className="w-full appearance-none px-3 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all cursor-pointer"
								>
									<option value="dhl">DHL</option>
									<option value="hermes">Hermes</option>
									<option value="ups">UPS</option>
									<option value="fedex">FedEx</option>
								</select>
							</div>

							<div className="flex flex-col gap-1.5">
								<label
									htmlFor="create-method"
									className="text-sm font-medium text-foreground"
								>
									Method
								</label>
								<select
									id="create-method"
									value={method}
									onChange={(e) => setMethod(e.target.value as ShippingMethod)}
									className="w-full appearance-none px-3 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all cursor-pointer"
								>
									<option value="standard">Standard</option>
									<option value="express">Express</option>
									<option value="same_day">Same Day</option>
								</select>
							</div>
						</Modal.Body>

						<Modal.Footer className="gap-2">
							<Button variant="outline" size="sm" onPress={handleClose}>
								Cancel
							</Button>
							<Button
								variant="primary"
								size="sm"
								isDisabled={!orderId.trim()}
								onPress={handleClose}
							>
								Create Shipment
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal.Root>
	);
}
