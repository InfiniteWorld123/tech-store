import { Button, Modal } from "@heroui/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type {
	ShippingListItemType,
	ShippingStatusType,
} from "#/server/shipping/shipping.types";

type Props = {
	item: ShippingListItemType | null;
	onClose: () => void;
};

const statusLabels: Record<ShippingStatusType, string> = {
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

export function UpdateStatusModal({ item, onClose }: Props) {
	const [status, setStatus] = useState<ShippingStatusType>(
		item?.status ?? "pending",
	);

	useEffect(() => {
		if (item) setStatus(item.status);
	}, [item]);

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
								Update Status
							</Modal.Heading>
							<Modal.CloseTrigger className="text-muted hover:text-foreground">
								<X size={18} />
							</Modal.CloseTrigger>
						</Modal.Header>

						<Modal.Body className="space-y-4">
							<div className="flex flex-col gap-1.5">
								<label
									htmlFor="update-status"
									className="text-sm font-medium text-foreground"
								>
									New Status
								</label>
								<select
									id="update-status"
									value={status}
									onChange={(e) =>
										setStatus(e.target.value as ShippingStatusType)
									}
									className="w-full appearance-none px-3 py-2.5 text-sm rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all cursor-pointer"
								>
									{ALL_STATUSES.map((s) => (
										<option key={s} value={s}>
											{statusLabels[s]}
										</option>
									))}
								</select>
							</div>
						</Modal.Body>

						<Modal.Footer className="gap-2">
							<Button variant="outline" size="sm" onPress={onClose}>
								Cancel
							</Button>
							<Button variant="primary" size="sm" onPress={onClose}>
								Save Status
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal.Root>
	);
}
