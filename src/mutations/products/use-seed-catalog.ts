import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { seedCatalogAction } from "#/server/catalog/seed-catalog/seed-catalog.actions";

export function useSeedCatalog() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => seedCatalogAction({ data: {} }),

		onSuccess: (result) => {
			const summary = result.data;

			toast.success(
				`Catalog seed complete: ${summary.productsCreated} products, ${summary.variantsCreated} variants created.`,
			);
		},

		onError: (err: Error) => {
			toast.danger(err.message || "Failed to seed catalog. Please try again.");
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			queryClient.invalidateQueries({ queryKey: ["colors"] });
			queryClient.invalidateQueries({ queryKey: ["storages"] });
			queryClient.invalidateQueries({ queryKey: ["rams"] });
			queryClient.invalidateQueries({ queryKey: ["screens"] });
			queryClient.invalidateQueries({ queryKey: ["analytics"] });
		},
	});
}
