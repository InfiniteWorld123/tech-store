import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRamAction } from "#/server/catalog/options/rams/rams.actions";
import type {
	DeleteRamInputType,
	ListRamsInputType,
	ListRamsOutputType,
} from "#/server/catalog/options/rams/rams.types";

type RamsCache = {
	data: ListRamsOutputType;
};

export function useDeleteRam({
	onSuccess,
	searching,
}: {
	onSuccess?: () => void;
	searching?: ListRamsInputType["searching"];
} = {}) {
	const queryClient = useQueryClient();
	const queryKey = ["rams", { searching }];

	return useMutation({
		mutationFn: (data: DeleteRamInputType) => deleteRamAction({ data }),

		onMutate: async ({ ramId }) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<RamsCache>(queryKey);

			queryClient.setQueryData<RamsCache>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					data: {
						...old.data,
						items: old.data.items.filter((item) => item.id !== ramId),
					},
				};
			});

			return { previous };
		},

		onError: (err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(queryKey, context.previous);
			}
			toast.danger(err.message || "Failed to delete RAM. Please try again.");
		},

		onSuccess: () => {
			toast.success("RAM deleted successfully");
			onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["rams"] });
		},
	});
}
