import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColorAction } from "#/server/catalog/options/colors/colors.actions";
import type {
	Color,
	CreateColorInputType,
	ListColorsInputType,
	ListColorsOutputType,
} from "#/server/catalog/options/colors/colors.types";

type ColorsCache = {
	data: ListColorsOutputType;
};

export function useCreateColor({
	onSuccess,
	searching,
}: {
	onSuccess?: () => void;
	searching?: ListColorsInputType["searching"];
} = {}) {
	const queryClient = useQueryClient();
	const queryKey = ["colors", { searching }];

	return useMutation({
		mutationFn: (data: CreateColorInputType) => createColorAction({ data }),

		onMutate: async (newColor) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<ColorsCache>(queryKey);

			queryClient.setQueryData<ColorsCache>(queryKey, (old) => {
				if (!old) return old;

				const optimisticItem: Color = {
					id: `optimistic-${Date.now()}`,
					name: newColor.name,
					hexCode: newColor.hexCode ?? null,
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
			toast.danger(err.message || "Failed to create color. Please try again.");
		},

		onSuccess: () => {
			toast.success("Color created successfully");
			onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["colors"] });
		},
	});
}
