import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStorageAction } from "#/server/catalog/options/storages/storages.actions";
import type {
	CreateStorageInputType,
	ListStoragesInputType,
	ListStoragesOutputType,
	Storage,
} from "#/server/catalog/options/storages/storages.types";

type StoragesCache = {
	data: ListStoragesOutputType;
};

export function useCreateStorage({
	onSuccess,
	searching,
}: {
	onSuccess?: () => void;
	searching?: ListStoragesInputType["searching"];
} = {}) {
	const queryClient = useQueryClient();
	const queryKey = ["storages", { searching }];

	return useMutation({
		mutationFn: (data: CreateStorageInputType) => createStorageAction({ data }),

		onMutate: async (newStorage) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<StoragesCache>(queryKey);

			queryClient.setQueryData<StoragesCache>(queryKey, (old) => {
				if (!old) return old;

				const optimisticItem: Storage = {
					id: `optimistic-${Date.now()}`,
					name: newStorage.name,
					valueGb: newStorage.valueGb,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};

				return {
					...old,
					data: {
						...old.data,
						items: [...old.data.items, optimisticItem],
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
				err.message || "Failed to create storage. Please try again.",
			);
		},

		onSuccess: () => {
			toast.success("Storage created successfully");
			onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["storages"] });
		},
	});
}
