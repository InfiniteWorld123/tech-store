import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStorageAction } from "#/server/catalog/options/storages/storages.actions";
import type {
	DeleteStorageInputType,
	ListStoragesInputType,
	ListStoragesOutputType,
} from "#/server/catalog/options/storages/storages.types";

type StoragesCache = {
	data: ListStoragesOutputType;
};

export function useDeleteStorage({
	onSuccess,
	searching,
}: {
	onSuccess?: () => void;
	searching?: ListStoragesInputType["searching"];
} = {}) {
	const queryClient = useQueryClient();
	const queryKey = ["storages", { searching }];

	return useMutation({
		mutationFn: (data: DeleteStorageInputType) => deleteStorageAction({ data }),

		onMutate: async ({ storageId }) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<StoragesCache>(queryKey);

			queryClient.setQueryData<StoragesCache>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					data: {
						...old.data,
						items: old.data.items.filter((item) => item.id !== storageId),
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
				err.message || "Failed to delete storage. Please try again.",
			);
		},

		onSuccess: () => {
			toast.success("Storage deleted successfully");
			onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["storages"] });
		},
	});
}
