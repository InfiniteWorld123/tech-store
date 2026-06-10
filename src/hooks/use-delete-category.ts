import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryAction } from "#/server/catalog/categories/categories.actions";
import type {
	DeleteCategoryInputType,
	ListCategoriesInputType,
	ListCategoriesOutputType,
} from "#/server/catalog/categories/categories.types";

type CategoriesCache = {
	data: ListCategoriesOutputType;
};

export function useDeleteCategory({
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
		mutationFn: (data: DeleteCategoryInputType) =>
			deleteCategoryAction({ data }),

		// --- Optimistic update ---
		onMutate: async ({ categoryId }) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<CategoriesCache>(queryKey);

			queryClient.setQueryData<CategoriesCache>(queryKey, (old) => {
				if (!old) return old;
				return {
					...old,
					data: {
						...old.data,
						items: old.data.items.filter((item) => item.id !== categoryId),
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
				err.message || "Failed to delete category. Please try again.",
			);
		},

		// --- Toast on confirmed success ---
		onSuccess: () => {
			toast.success("Category deleted successfully");
			onSuccess?.();
		},

		// --- Always resync with the server ---
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}
