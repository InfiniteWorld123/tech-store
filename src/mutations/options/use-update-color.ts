import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateColorAction } from "#/server/catalog/options/colors/colors.actions";
import type {
	ListColorsInputType,
	ListColorsOutputType,
	UpdateColorInputType,
} from "#/server/catalog/options/colors/colors.types";

type ColorsCache = {
	data: ListColorsOutputType;
};

export function useUpdateColor({
	onSuccess,
	searching,
}: {
	onSuccess?: () => void;
	searching?: ListColorsInputType["searching"];
} = {}) {
	const queryClient = useQueryClient();
	const queryKey = ["colors", { searching }];

	return useMutation({
		mutationFn: (data: UpdateColorInputType) => updateColorAction({ data }),

		onMutate: async (updated) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<ColorsCache>(queryKey);

			queryClient.setQueryData<ColorsCache>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					data: {
						...old.data,
						items: old.data.items.map((item) =>
							item.id === updated.colorId
								? {
										...item,
										name: updated.name ?? item.name,
										hexCode:
											updated.hexCode !== undefined
												? updated.hexCode
												: item.hexCode,
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
			toast.danger(err.message || "Failed to update color. Please try again.");
		},

		onSuccess: () => {
			toast.success("Color updated successfully");
			onSuccess?.();
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["colors"] });
		},
	});
}
