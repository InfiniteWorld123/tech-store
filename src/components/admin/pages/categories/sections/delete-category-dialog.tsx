import { AlertDialog, Button } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useDeleteCategory } from "#/hooks/use-delete-category";
import { Route } from "#/routes/admin/categories";
import type { CategoryWithCount } from "#/server/catalog/categories/categories.types";

type Props = {
	category: CategoryWithCount | null;
	onClose: () => void;
};

export function DeleteCategoryDialog({ category, onClose }: Props) {
	const { searching } = Route.useSearch();
	const { mutate, isPending } = useDeleteCategory({
		onSuccess: onClose,
		searching,
	});

	const handleDelete = () => {
		if (!category) return;
		mutate({ categoryId: category.id });
	};

	return (
		<AlertDialog.Root
			isOpen={category !== null}
			onOpenChange={(open) => !open && onClose()}
		>
			<AlertDialog.Backdrop>
				<AlertDialog.Container>
					<AlertDialog.Dialog>
						<AlertDialog.Header>
							<div className="flex items-center gap-3">
								<div className="size-10 rounded-xl bg-danger/10 flex items-center justify-center shrink-0">
									<Trash2 size={18} className="text-danger" />
								</div>
								<AlertDialog.Heading className="text-base font-semibold text-foreground">
									Delete "{category?.name}"?
								</AlertDialog.Heading>
							</div>
						</AlertDialog.Header>

						<AlertDialog.Body>
							<p className="text-sm text-muted">
								This will permanently delete the{" "}
								<span className="font-medium text-foreground">
									{category?.name}
								</span>{" "}
								category. This action cannot be undone.
							</p>
							{(category?.totalProducts ?? 0) > 0 && (
								<p className="mt-2 text-sm text-warning font-medium">
									⚠ This category has {category?.totalProducts} product
									{category?.totalProducts !== 1 ? "s" : ""} — those products
									must be reassigned before deleting.
								</p>
							)}
						</AlertDialog.Body>

						<AlertDialog.Footer className="gap-2">
							<Button
								variant="outline"
								size="sm"
								onPress={onClose}
								isDisabled={isPending}
							>
								Cancel
							</Button>
							<Button
								variant="primary"
								color="danger"
								size="sm"
								isLoading={isPending}
								onPress={handleDelete}
							>
								Delete Category
							</Button>
						</AlertDialog.Footer>
					</AlertDialog.Dialog>
				</AlertDialog.Container>
			</AlertDialog.Backdrop>
		</AlertDialog.Root>
	);
}
