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
import type { ListColorsInputType } from "#/server/catalog/options/colors/colors.types";
import type { ListRamsInputType } from "#/server/catalog/options/rams/rams.types";
import type { ListScreensInputType } from "#/server/catalog/options/screens/screens.types";
import type { ListStoragesInputType } from "#/server/catalog/options/storages/storages.types";

type SearchingParam = {
	search?: string;
	searchType: "name" | "hexCode" | "valueGb" | "valueInches";
};

type UseOptionReturn = {
	rows: OptionRow[];
	isLoading: boolean;
	isError: boolean;
};

const isColorSearchType = (
	value: SearchingParam["searchType"],
): value is NonNullable<ListColorsInputType["searching"]>["searchType"] =>
	value === "name" || value === "hexCode";

const isCapacitySearchType = (
	value: SearchingParam["searchType"],
): value is NonNullable<ListStoragesInputType["searching"]>["searchType"] =>
	value === "name" || value === "valueGb";

const isScreenSearchType = (
	value: SearchingParam["searchType"],
): value is NonNullable<ListScreensInputType["searching"]>["searchType"] =>
	value === "name" || value === "valueInches";

export function useOptionsPage(
	tab: OptionType,
	searching?: SearchingParam,
): UseOptionReturn {
	const colorsSearching: ListColorsInputType["searching"] =
		tab === "colors" &&
		searching?.search &&
		isColorSearchType(searching.searchType)
			? { search: searching.search, searchType: searching.searchType }
			: undefined;
	const storagesSearching: ListStoragesInputType["searching"] =
		tab === "storages" &&
		searching?.search &&
		isCapacitySearchType(searching.searchType)
			? { search: searching.search, searchType: searching.searchType }
			: undefined;
	const ramsSearching: ListRamsInputType["searching"] =
		tab === "rams" &&
		searching?.search &&
		isCapacitySearchType(searching.searchType)
			? { search: searching.search, searchType: searching.searchType }
			: undefined;
	const screensSearching: ListScreensInputType["searching"] =
		tab === "screens" &&
		searching?.search &&
		isScreenSearchType(searching.searchType)
			? { search: searching.search, searchType: searching.searchType }
			: undefined;

	const colors = useQuery({
		...listColorsQueryOptions({ searching: colorsSearching }),
		enabled: tab === "colors",
	});
	const storages = useQuery({
		...listStoragesQueryOptions({ searching: storagesSearching }),
		enabled: tab === "storages",
	});
	const rams = useQuery({
		...listRamsQueryOptions({ searching: ramsSearching }),
		enabled: tab === "rams",
	});
	const screens = useQuery({
		...listScreensQueryOptions({ searching: screensSearching }),
		enabled: tab === "screens",
	});

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
