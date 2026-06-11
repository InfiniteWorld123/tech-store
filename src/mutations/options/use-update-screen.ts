import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScreenAction } from "#/server/catalog/options/screens/screens.actions";
import type {
	ListScreensInputType,
	ListScreensOutputType,
	UpdateScreenInputType,
} from "#/server/catalog/options/screens/screens.types";

type ScreensCache = {
	data: ListScreensOutputType;
};

export function useUpdateScreen({
	onSuccess,
	searching,
}: {
	onSuccess?: () => void;
	searching?: ListScreensInputType["searching"];
} = {}) {
	const queryClient = useQueryClient();
	const queryKey = ["screens", { searching }];

	return useMutation({
		mutationFn: (data: UpdateScreenInputType) => updateScreenAction({ data }),

		onMutate: async (updated) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<ScreensCache>(queryKey);

			queryClient.setQueryData<ScreensCache>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					data: {
						...old.data,
						items: old.data.items.map((item) =>
							item.id === updated.screenId
								? {
										...item,
										name: updated.name ?? item.name,
										valueInches: updated.valueInches ?? item.valueInches,
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
			toast.danger(err.message || "Failed to update screen. Please try again.");
		},

		onSuccess: () => {
			toast.success("Screen updated successfully");
			onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["screens"] });
		},
	});
}
