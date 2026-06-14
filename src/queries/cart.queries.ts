import { queryOptions } from "@tanstack/react-query";
import { getCartAction } from "#/server/cart/cart.actions";

export const getCartQueryOptions = queryOptions({
	queryKey: ["cart"],
	queryFn: () => getCartAction({ data: {} }),
	staleTime: 0,
});
