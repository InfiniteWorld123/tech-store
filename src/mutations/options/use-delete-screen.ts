import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteScreenAction } from "#/server/catalog/options/screens/screens.actions";
import type {
	DeleteScreenInputType,
	ListScreensInputType,
	ListScreensOutputType,
} from "#/server/catalog/options/screens/screens.types";

type ScreensCache = {
	data: ListScreensOutputType;
};

export function useDeleteScreen({
	onSuccess,
	searching,
}: {
	onSuccess?: () => void;
	searching?: ListScreensInputType["searching"];
} = {}) {
	const queryClient = useQueryClient();
	const queryKey = ["screens", { searching }];

	return useMutation({
		mutationFn: (data: DeleteScreenInputType) => deleteScreenAction({ data }),

		onMutate: async ({ screenId }) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<ScreensCache>(queryKey);

			queryClient.setQueryData<ScreensCache>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					data: {
						...old.data,
						items: old.data.items.filter((item) => item.id !== screenId),
					},
				};
			});

			return { previous };
		},

		onError: (err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(queryKey, context.previous);
			}
			toast.danger(err.message || "Failed to delete screen. Please try again.");
		},

		onSuccess: () => {
			toast.success("Screen deleted successfully");
			onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["screens"] });
		},
	});
}
