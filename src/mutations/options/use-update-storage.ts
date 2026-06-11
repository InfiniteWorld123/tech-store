import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStorageAction } from "#/server/catalog/options/storages/storages.actions";
import type {
	ListStoragesInputType,
	ListStoragesOutputType,
	UpdateStorageInputType,
} from "#/server/catalog/options/storages/storages.types";

type StoragesCache = {
	data: ListStoragesOutputType;
};

export function useUpdateStorage({
	onSuccess,
	searching,
}: {
	onSuccess?: () => void;
	searching?: ListStoragesInputType["searching"];
} = {}) {
	const queryClient = useQueryClient();
	const queryKey = ["storages", { searching }];

	return useMutation({
		mutationFn: (data: UpdateStorageInputType) => updateStorageAction({ data }),

		onMutate: async (updated) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<StoragesCache>(queryKey);

			queryClient.setQueryData<StoragesCache>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					data: {
						...old.data,
						items: old.data.items.map((item) =>
							item.id === updated.storageId
								? {
										...item,
										name: updated.name ?? item.name,
										valueGb: updated.valueGb ?? item.valueGb,
										updatedAt: new Date().toISOString(),
									}
								: item,
						),
					},
				};
			});

			return { previous };
		},

		onError: (err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(queryKey, context.previous);
			}
			toast.danger(
				err.message || "Failed to update storage. Please try again.",
			);
		},

		onSuccess: () => {
			toast.success("Storage updated successfully");
			onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["storages"] });
		},
	});
}
