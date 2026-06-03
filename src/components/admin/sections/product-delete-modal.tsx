import { Button, Modal } from "@heroui/react";
import { Trash2 } from "lucide-react";
import type { AdminProductListItemType } from "#/server/catalog/products/products.types";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	product: AdminProductListItemType | null;
	bulk?: boolean;
	count?: number;
};

export function ProductDeleteModal({
	isOpen,
	onClose,
	product,
	bulk = false,
	count = 0,
}: Props) {
	const isBulk = bulk && count > 0;
	const targetLabel = isBulk
		? `${count} products`
		: (product?.name ?? "this product");

	return (
		<Modal isOpen={isOpen} onOpenChange={onClose}>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-[400px]">
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Icon className="bg-danger/10 text-danger">
								<Trash2 size={20} />
							</Modal.Icon>
							<Modal.Heading>Delete {isBulk ? "Products" : "Product"}</Modal.Heading>
						</Modal.Header>

						<Modal.Body>
							<p className="text-sm text-muted">
								Are you sure you want to delete{" "}
								<span className="font-medium text-foreground">{targetLabel}</span>?
								This action cannot be undone.
							</p>
						</Modal.Body>

						<Modal.Footer className="flex justify-end gap-2">
							<Button variant="ghost" onPress={onClose}>
								Cancel
							</Button>
							<Button
								variant="danger"
								onPress={() => console.log("confirm delete:", isBulk ? count : product?.id)}
							>
								Delete
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}
