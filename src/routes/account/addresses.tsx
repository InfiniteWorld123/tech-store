import { createFileRoute } from "@tanstack/react-router";
import { AddressesPage } from "#/components/account/pages/addresses-page";
import { listAddressesQueryOptions } from "#/queries/addresses.queries";

export const Route = createFileRoute("/account/addresses")({
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(listAddressesQueryOptions).catch(() => null),
	component: AddressesPage,
});
