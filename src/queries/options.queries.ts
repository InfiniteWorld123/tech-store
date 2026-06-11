import { queryOptions } from "@tanstack/react-query";
import { listColorsAction } from "#/server/catalog/options/colors/colors.actions";
import type { ListColorsInputType } from "#/server/catalog/options/colors/colors.types";
import { listRamsAction } from "#/server/catalog/options/rams/rams.actions";
import type { ListRamsInputType } from "#/server/catalog/options/rams/rams.types";
import { listScreensAction } from "#/server/catalog/options/screens/screens.actions";
import type { ListScreensInputType } from "#/server/catalog/options/screens/screens.types";
import { listStoragesAction } from "#/server/catalog/options/storages/storages.actions";
import type { ListStoragesInputType } from "#/server/catalog/options/storages/storages.types";

export const listColorsQueryOptions = (data: ListColorsInputType) =>
	queryOptions({
		queryKey: ["colors", data],
		queryFn: () => listColorsAction({ data }),
	});

export const listStoragesQueryOptions = (data: ListStoragesInputType) =>
	queryOptions({
		queryKey: ["storages", data],
		queryFn: () => listStoragesAction({ data }),
	});

export const listRamsQueryOptions = (data: ListRamsInputType) =>
	queryOptions({
		queryKey: ["rams", data],
		queryFn: () => listRamsAction({ data }),
	});

export const listScreensQueryOptions = (data: ListScreensInputType) =>
	queryOptions({
		queryKey: ["screens", data],
		queryFn: () => listScreensAction({ data }),
	});
