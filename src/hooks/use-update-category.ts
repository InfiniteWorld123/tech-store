import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategoryAction } from "#/server/catalog/categories/categories.actions";
import type {
	ListCategoriesInputType,
	ListCategoriesOutputType,
	UpdateCategoryInputType,
} from "#/server/catalog/categories/categories.types";

type CategoriesCache = {
	data: ListCategoriesOutputType;
};

export function useUpdateCategory({
	onSuccess,
	searching,
}: {
	onSuccess?: () => void;
	searching?: ListCategoriesInputType["searching"];
} = {}) {
	const queryClient = useQueryClient();

	// Match the key shape used by listCategoriesQueryOptions
	const queryKey = ["categories", { searching }];

	return useMutation({
		mutationFn: (data: UpdateCategoryInputType) =>
			updateCategoryAction({ data }),

		// --- Optimistic update ---
		onMutate: async (updated) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<CategoriesCache>(queryKey);

			queryClient.setQueryData<CategoriesCache>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					data: {
						...old.data,
						items: old.data.items.map((item) =>
							item.id === updated.categoryId
								? {
										...item,
										name: updated.name ?? item.name,
										slug: updated.slug ?? item.slug,
										// undefined means "not touched"; null means "explicitly cleared"
										icon: updated.icon !== undefined ? updated.icon : item.icon,
										iconColor:
											updated.iconColor !== undefined
												? updated.iconColor
												: item.iconColor,
										iconBg:
											updated.iconBg !== undefined
												? updated.iconBg
												: item.iconBg,
										updatedAt: new Date().toISOString(),
									}
								: item,
						),
					},
				};
			});

			return { previous };
		},

		// --- Rollback on error ---
		onError: (err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(queryKey, context.previous);
			}
			toast.danger(
				err.message || "Failed to update category. Please try again.",
			);
		},

		// --- Toast on confirmed success ---
		onSuccess: () => {
			toast.success("Category updated successfully");
			onSuccess?.();
		},

		// --- Always resync with the server ---
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}
