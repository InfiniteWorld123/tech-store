import {
	Button,
	InputGroup,
	Label,
	ListBox,
	Modal,
	Select,
	Switch,
	TextField,
} from "@heroui/react";
import type { AdminProductListItemType } from "#/server/catalog/products/products.types";

const MOCK_CATEGORIES = [
	{ id: "1", name: "Laptops" },
	{ id: "2", name: "Smartphones" },
	{ id: "3", name: "Tablets" },
	{ id: "4", name: "Audio" },
	{ id: "5", name: "Accessories" },
	{ id: "6", name: "Gaming" },
];

type Props = {
	isOpen: boolean;
	onClose: () => void;
	product: AdminProductListItemType | null;
};

export function ProductFormModal({ isOpen, onClose, product }: Props) {
	const isEditing = product !== null;

	return (
		<Modal isOpen={isOpen} onOpenChange={onClose}>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog className="sm:max-w-[560px]">
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Heading>
								{isEditing ? "Edit Product" : "Add Product"}
							</Modal.Heading>
						</Modal.Header>

						<Modal.Body className="flex flex-col gap-4">
							{/* Name + Brand */}
							<div className="grid grid-cols-2 gap-4">
								<TextField className="flex flex-col gap-1.5">
									<Label className="text-sm font-medium">
										Name <span className="text-danger">*</span>
									</Label>
									<InputGroup variant="primary">
										<InputGroup.Input
											placeholder="e.g. MacBook Pro 14"
											defaultValue={product?.name ?? ""}
										/>
									</InputGroup>
								</TextField>

								<TextField className="flex flex-col gap-1.5">
									<Label className="text-sm font-medium">
										Brand <span className="text-danger">*</span>
									</Label>
									<InputGroup variant="primary">
										<InputGroup.Input
											placeholder="e.g. Apple"
											defaultValue={product?.brand ?? ""}
										/>
									</InputGroup>
								</TextField>
							</div>

							{/* Slug */}
							<TextField className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">
									Slug <span className="text-danger">*</span>
								</Label>
								<InputGroup variant="primary">
									<InputGroup.Input
										placeholder="e.g. macbook-pro-14"
										defaultValue={product?.slug ?? ""}
									/>
								</InputGroup>
							</TextField>

							{/* Category */}
							<Select
								className="flex flex-col gap-1.5"
								placeholder="Select a category"
							>
								<Label className="text-sm font-medium">
									Category <span className="text-danger">*</span>
								</Label>
								<Select.Trigger>
									<Select.Value />
									<Select.Indicator />
								</Select.Trigger>
								<Select.Popover>
									<ListBox>
										{MOCK_CATEGORIES.map((cat) => (
											<ListBox.Item
												key={cat.id}
												id={cat.id}
												textValue={cat.name}
											>
												{cat.name}
												<ListBox.ItemIndicator />
											</ListBox.Item>
										))}
									</ListBox>
								</Select.Popover>
							</Select>

							{/* Short Description */}
							<TextField className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">Short Description</Label>
								<InputGroup variant="primary">
									<InputGroup.Input placeholder="Brief product summary…" />
								</InputGroup>
							</TextField>

							{/* Description */}
							<TextField className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium">
									Description <span className="text-danger">*</span>
								</Label>
								<InputGroup variant="primary">
									<InputGroup.TextArea
										placeholder="Full product description…"
										rows={4}
									/>
								</InputGroup>
							</TextField>

							{/* Image URL + Warranty */}
							<div className="grid grid-cols-2 gap-4">
								<TextField className="flex flex-col gap-1.5">
									<Label className="text-sm font-medium">Image URL</Label>
									<InputGroup variant="primary">
										<InputGroup.Input
											placeholder="https://…"
											defaultValue={product?.image ?? ""}
										/>
									</InputGroup>
								</TextField>

								<TextField className="flex flex-col gap-1.5">
									<Label className="text-sm font-medium">Warranty Info</Label>
									<InputGroup variant="primary">
										<InputGroup.Input placeholder="e.g. 1 year warranty" />
									</InputGroup>
								</TextField>
							</div>

							{/* Flags */}
							<div className="flex flex-col gap-3 pt-1">
								<p className="text-sm font-medium text-foreground">Flags</p>
								<div className="flex flex-wrap gap-6">
									<Switch defaultSelected={product?.isActive ?? true}>
										<Switch.Control>
											<Switch.Thumb />
										</Switch.Control>
										<Switch.Content>
											<Label className="text-sm">Active</Label>
										</Switch.Content>
									</Switch>

									<Switch defaultSelected={product?.isFeatured ?? false}>
										<Switch.Control>
											<Switch.Thumb />
										</Switch.Control>
										<Switch.Content>
											<Label className="text-sm">Featured</Label>
										</Switch.Content>
									</Switch>

									<Switch defaultSelected={product?.isBestseller ?? false}>
										<Switch.Control>
											<Switch.Thumb />
										</Switch.Control>
										<Switch.Content>
											<Label className="text-sm">Bestseller</Label>
										</Switch.Content>
									</Switch>
								</div>
							</div>
						</Modal.Body>

						<Modal.Footer className="flex justify-end gap-2">
							<Button variant="ghost" onPress={onClose}>
								Cancel
							</Button>
							<Button
								variant="primary"
								onPress={() => console.log("submit product form")}
							>
								{isEditing ? "Save Changes" : "Create Product"}
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}
