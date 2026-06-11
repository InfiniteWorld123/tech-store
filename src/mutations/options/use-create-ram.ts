import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRamAction } from "#/server/catalog/options/rams/rams.actions";
import type {
	CreateRamInputType,
	ListRamsInputType,
	ListRamsOutputType,
	Ram,
} from "#/server/catalog/options/rams/rams.types";

type RamsCache = {
	data: ListRamsOutputType;
};

export function useCreateRam({
	onSuccess,
	searching,
}: {
	onSuccess?: () => void;
	searching?: ListRamsInputType["searching"];
} = {}) {
	const queryClient = useQueryClient();
	const queryKey = ["rams", { searching }];

	return useMutation({
		mutationFn: (data: CreateRamInputType) => createRamAction({ data }),

		onMutate: async (newRam) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<RamsCache>(queryKey);

			queryClient.setQueryData<RamsCache>(queryKey, (old) => {
				if (!old) return old;

				const optimisticItem: Ram = {
					id: `optimistic-${Date.now()}`,
					name: newRam.name,
					valueGb: newRam.valueGb,
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
			toast.danger(err.message || "Failed to create RAM. Please try again.");
		},

		onSuccess: () => {
			toast.success("RAM created successfully");
			onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["rams"] });
		},
	});
}
