import { queryOptions } from "@tanstack/react-query";
import { listAddressesAction } from "#/server/addresses/addresses.actions";

export const listAddressesQueryOptions = queryOptions({
	queryKey: ["addresses"],
	queryFn: () => listAddressesAction({ data: {} }),
});
