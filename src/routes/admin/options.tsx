import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { OptionsPage } from "#/components/admin/pages/options/options-page";
import {
	listColorsQueryOptions,
	listRamsQueryOptions,
	listScreensQueryOptions,
	listStoragesQueryOptions,
} from "#/queries/options.queries";

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

export const Route = createFileRoute("/admin/options")({
	component: OptionsPage,
	validateSearch: optionsSearchSchema,
	loaderDeps: ({ search }) => ({
		tab: search.tab,
		search: search.search,
		searchType: search.searchType,
	}),
	loader: ({ context, deps }) => {
		const searching = deps.search
			? ({ search: deps.search, searchType: deps.searchType } as any)
			: undefined;

		switch (deps.tab) {
			case "colors":
				return context.queryClient.ensureQueryData(
					listColorsQueryOptions({ searching }),
				);
			case "storages":
				return context.queryClient.ensureQueryData(
					listStoragesQueryOptions({ searching }),
				);
			case "rams":
				return context.queryClient.ensureQueryData(
					listRamsQueryOptions({ searching }),
				);
			case "screens":
				return context.queryClient.ensureQueryData(
					listScreensQueryOptions({ searching }),
				);
		}
	},
});
