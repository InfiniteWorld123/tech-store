import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createScreenAction } from "#/server/catalog/options/screens/screens.actions";
import type {
	CreateScreenInputType,
	ListScreensInputType,
	ListScreensOutputType,
	Screen,
} from "#/server/catalog/options/screens/screens.types";

type ScreensCache = {
	data: ListScreensOutputType;
};

export function useCreateScreen({
	onSuccess,
	searching,
}: {
	onSuccess?: () => void;
	searching?: ListScreensInputType["searching"];
} = {}) {
	const queryClient = useQueryClient();
	const queryKey = ["screens", { searching }];

	return useMutation({
		mutationFn: (data: CreateScreenInputType) => createScreenAction({ data }),

		onMutate: async (newScreen) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<ScreensCache>(queryKey);

			queryClient.setQueryData<ScreensCache>(queryKey, (old) => {
				if (!old) return old;

				const optimisticItem: Screen = {
					id: `optimistic-${Date.now()}`,
					name: newScreen.name,
					valueInches: newScreen.valueInches,
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
			toast.danger(err.message || "Failed to create screen. Please try again.");
		},

		onSuccess: () => {
			toast.success("Screen created successfully");
			onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["screens"] });
		},
	});
}
