import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import {
	AdminRouteError,
	AdminRouteLoading,
} from "#/components/admin/layout/admin-route-states";
import { OptionsPage } from "#/components/admin/pages/options/options-page";
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

const VALID_SEARCH_TYPES = {
	colors: ["name", "hexCode"],
	storages: ["name", "valueGb"],
	rams: ["name", "valueGb"],
	screens: ["name", "valueInches"],
} as const;

const optionsSearchSchema = z
	.object({
		tab: z.enum(["colors", "storages", "rams", "screens"]).default("colors"),
		search: z.string().trim().min(1).optional(),
		searchType: z
			.enum(["name", "hexCode", "valueGb", "valueInches"])
			.default("name"),
	})
	.transform((data) => ({
		...data,
		// If the current searchType isn't valid for this tab, reset to "name"
		searchType: (VALID_SEARCH_TYPES[data.tab] as readonly string[]).includes(
			data.searchType,
		)
			? data.searchType
			: ("name" as const),
	}));

const getColorsSearching = (
	search: string | undefined,
	searchType: "name" | "hexCode" | "valueGb" | "valueInches",
): ListColorsInputType["searching"] =>
	search
		? {
				search,
				searchType: searchType === "hexCode" ? "hexCode" : "name",
			}
		: undefined;

const getCapacitySearching = (
	search: string | undefined,
	searchType: "name" | "hexCode" | "valueGb" | "valueInches",
): ListStoragesInputType["searching"] =>
	search
		? {
				search,
				searchType: searchType === "valueGb" ? "valueGb" : "name",
			}
		: undefined;

const getScreensSearching = (
	search: string | undefined,
	searchType: "name" | "hexCode" | "valueGb" | "valueInches",
): ListScreensInputType["searching"] =>
	search
		? {
				search,
				searchType: searchType === "valueInches" ? "valueInches" : "name",
			}
		: undefined;

export const Route = createFileRoute("/admin/options")({
	component: OptionsPage,
	validateSearch: optionsSearchSchema,
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) => {
		switch (deps.tab) {
			case "colors":
				return context.queryClient.ensureQueryData(
					listColorsQueryOptions({
						searching: getColorsSearching(deps.search, deps.searchType),
					}),
				);
			case "storages":
				return context.queryClient.ensureQueryData(
					listStoragesQueryOptions({
						searching: getCapacitySearching(deps.search, deps.searchType),
					}),
				);
			case "rams":
				return context.queryClient.ensureQueryData(
					listRamsQueryOptions({
						searching: getCapacitySearching(
							deps.search,
							deps.searchType,
						) as ListRamsInputType["searching"],
					}),
				);
			case "screens":
				return context.queryClient.ensureQueryData(
					listScreensQueryOptions({
						searching: getScreensSearching(deps.search, deps.searchType),
					}),
				);
		}
	},
	pendingComponent: AdminRouteLoading,
	errorComponent: ({ error }) => <AdminRouteError error={error as Error} />,
});
