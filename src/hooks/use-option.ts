import { useQuery } from "@tanstack/react-query";
import type {
	OptionRow,
	OptionType,
} from "#/components/admin/pages/options/option-configs";
import {
	listColorsQueryOptions,
	listRamsQueryOptions,
	listScreensQueryOptions,
	listStoragesQueryOptions,
} from "#/queries/options.queries";

type SearchingParam = {
	search?: string;
	searchType: "name" | "hexCode" | "valueGb" | "valueInches";
};

type UseOptionReturn = {
	rows: OptionRow[];
	isLoading: boolean;
	isError: boolean;
};

export function useOption(
	tab: OptionType,
	searching?: SearchingParam,
): UseOptionReturn {
	// Only send searching to the server when there's a non-empty search term.
	const activeSearch = searching?.search ? searching : undefined;

	const colors = useQuery({
		...listColorsQueryOptions({ searching: activeSearch as any }),
		enabled: tab === "colors",
	});
	const storages = useQuery({
		...listStoragesQueryOptions({ searching: activeSearch as any }),
		enabled: tab === "storages",
	});
	const rams = useQuery({
		...listRamsQueryOptions({ searching: activeSearch as any }),
		enabled: tab === "rams",
	});
	const screens = useQuery({
		...listScreensQueryOptions({ searching: activeSearch as any }),
		enabled: tab === "screens",
	});

	// Server responses are wrapped in JsonOk<T> = { data: T, ... }
	switch (tab) {
		case "colors":
			return {
				rows: (colors.data?.data.items ?? []).map((c) => ({
					id: c.id,
					name: c.name,
					value: c.hexCode,
					createdAt: c.createdAt,
					updatedAt: c.updatedAt,
				})),
				isLoading: colors.isLoading,
				isError: colors.isError,
			};
		case "storages":
			return {
				rows: (storages.data?.data.items ?? []).map((s) => ({
					id: s.id,
					name: s.name,
					value: s.valueGb,
					createdAt: s.createdAt,
					updatedAt: s.updatedAt,
				})),
				isLoading: storages.isLoading,
				isError: storages.isError,
			};
		case "rams":
			return {
				rows: (rams.data?.data.items ?? []).map((r) => ({
					id: r.id,
					name: r.name,
					value: r.valueGb,
					createdAt: r.createdAt,
					updatedAt: r.updatedAt,
				})),
				isLoading: rams.isLoading,
				isError: rams.isError,
			};
		case "screens":
			return {
				rows: (screens.data?.data.items ?? []).map((s) => ({
					id: s.id,
					name: s.name,
					value: s.valueInches,
					createdAt: s.createdAt,
					updatedAt: s.updatedAt,
				})),
				isLoading: screens.isLoading,
				isError: screens.isError,
			};
	}
}
