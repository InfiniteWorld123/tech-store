import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRamAction } from "#/server/catalog/options/rams/rams.actions";
import type {
	ListRamsInputType,
	ListRamsOutputType,
	UpdateRamInputType,
} from "#/server/catalog/options/rams/rams.types";

type RamsCache = {
	data: ListRamsOutputType;
};

export function useUpdateRam({
	onSuccess,
	searching,
}: {
	onSuccess?: () => void;
	searching?: ListRamsInputType["searching"];
} = {}) {
	const queryClient = useQueryClient();
	const queryKey = ["rams", { searching }];

	return useMutation({
		mutationFn: (data: UpdateRamInputType) => updateRamAction({ data }),

		onMutate: async (updated) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<RamsCache>(queryKey);

			queryClient.setQueryData<RamsCache>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					data: {
						...old.data,
						items: old.data.items.map((item) =>
							item.id === updated.ramId
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
			toast.danger(err.message || "Failed to update RAM. Please try again.");
		},

		onSuccess: () => {
			toast.success("RAM updated successfully");
			onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["rams"] });
		},
	});
}
