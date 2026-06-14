"use client";
import { AlertDialog, Button } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useDeleteColor } from "#/mutations/options/use-delete-color";
import { useDeleteRam } from "#/mutations/options/use-delete-ram";
import { useDeleteScreen } from "#/mutations/options/use-delete-screen";
import { useDeleteStorage } from "#/mutations/options/use-delete-storage";
import type { OptionConfig, OptionRow } from "../option-configs";

type Props = {
	config: OptionConfig;
	row: OptionRow | null;
	onClose: () => void;
};

export function DeleteOptionDialog({ config, row, onClose }: Props) {
	const deleteColor = useDeleteColor({ onSuccess: onClose });
	const deleteStorage = useDeleteStorage({ onSuccess: onClose });
	const deleteRam = useDeleteRam({ onSuccess: onClose });
	const deleteScreen = useDeleteScreen({ onSuccess: onClose });
	const isDeleting =
		deleteColor.isPending ||
		deleteStorage.isPending ||
		deleteRam.isPending ||
		deleteScreen.isPending;

	const handleDelete = async () => {
		if (!row) return;

		if (config.key === "colors") {
			await deleteColor.mutateAsync({ colorId: row.id });
			return;
		}

		if (config.key === "storages") {
			await deleteStorage.mutateAsync({ storageId: row.id });
			return;
		}

		if (config.key === "rams") {
			await deleteRam.mutateAsync({ ramId: row.id });
			return;
		}

		await deleteScreen.mutateAsync({ screenId: row.id });
		onClose();
	};

	return (
		<AlertDialog.Root
			isOpen={row !== null}
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
									Delete "{row?.name}"?
								</AlertDialog.Heading>
							</div>
						</AlertDialog.Header>

						<AlertDialog.Body>
							<p className="text-sm text-muted">
								This will permanently delete the{" "}
								<span className="font-medium text-foreground">{row?.name}</span>{" "}
								{config.singular}. This action cannot be undone.
							</p>
						</AlertDialog.Body>

						<AlertDialog.Footer className="gap-2">
							<Button
								variant="outline"
								size="sm"
								onPress={onClose}
								isDisabled={isDeleting}
							>
								Cancel
							</Button>
							<Button
								variant="danger"
								size="sm"
								onPress={handleDelete}
								isPending={isDeleting}
								isDisabled={isDeleting}
							>
								Delete {config.singular}
							</Button>
						</AlertDialog.Footer>
					</AlertDialog.Dialog>
				</AlertDialog.Container>
			</AlertDialog.Backdrop>
		</AlertDialog.Root>
	);
}
