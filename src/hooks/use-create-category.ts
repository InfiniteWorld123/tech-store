import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryAction } from "#/server/catalog/categories/categories.actions";
import type {
	CategoryWithCount,
	CreateCategoryInputType,
	ListCategoriesInputType,
	ListCategoriesOutputType,
} from "#/server/catalog/categories/categories.types";

type CategoriesCache = {
	data: ListCategoriesOutputType;
};

export function useCreateCategory({
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
		mutationFn: (data: CreateCategoryInputType) =>
			createCategoryAction({ data }),

		// --- Optimistic update ---
		onMutate: async (newCategory) => {
			// 1. Cancel any in-flight refetches so they don't overwrite us
			await queryClient.cancelQueries({ queryKey });

			// 2. Snapshot the current cache for rollback
			const previous = queryClient.getQueryData<CategoriesCache>(queryKey);

			// 3. Inject a temporary optimistic item into the cache
			queryClient.setQueryData<CategoriesCache>(queryKey, (old) => {
				if (!old) return old;

				const optimisticItem: CategoryWithCount = {
					id: `optimistic-${Date.now()}`,
					name: newCategory.name,
					slug: newCategory.slug,
					icon: newCategory.icon ?? null,
					iconColor: newCategory.iconColor ?? null,
					iconBg: newCategory.iconBg ?? null,
					totalProducts: 0,
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

			// 4. Return snapshot so onError can roll back
			return { previous };
		},

		// --- Rollback on error ---
		onError: (err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(queryKey, context.previous);
			}
			toast.danger(
				err.message || "Failed to create category. Please try again.",
			);
		},

		// --- Toast on confirmed success ---
		onSuccess: () => {
			toast.success("Category created successfully");
			onSuccess?.();
		},

		// --- Always resync with the server ---
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}
