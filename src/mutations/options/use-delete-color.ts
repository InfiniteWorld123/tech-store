import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteColorAction } from "#/server/catalog/options/colors/colors.actions";
import type {
	DeleteColorInputType,
	ListColorsInputType,
	ListColorsOutputType,
} from "#/server/catalog/options/colors/colors.types";

type ColorsCache = {
	data: ListColorsOutputType;
};

export function useDeleteColor({
	onSuccess,
	searching,
}: {
	onSuccess?: () => void;
	searching?: ListColorsInputType["searching"];
} = {}) {
	const queryClient = useQueryClient();
	const queryKey = ["colors", { searching }];

	return useMutation({
		mutationFn: (data: DeleteColorInputType) => deleteColorAction({ data }),

		onMutate: async ({ colorId }) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<ColorsCache>(queryKey);

			queryClient.setQueryData<ColorsCache>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					data: {
						...old.data,
						items: old.data.items.filter((item) => item.id !== colorId),
					},
				};
			});

			return { previous };
		},

		onError: (err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(queryKey, context.previous);
			}
			toast.danger(err.message || "Failed to delete color. Please try again.");
		},

		onSuccess: () => {
			toast.success("Color deleted successfully");
			onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["colors"] });
		},
	});
}
